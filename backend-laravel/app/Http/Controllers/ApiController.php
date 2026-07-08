<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    public function health()
    {
        return response()->json([
            'status' => 'OK',
            'message' => 'ClothingM Laravel API is running',
        ]);
    }

    public function products()
    {
        return DB::table('products')->orderByDesc('created_at')->get();
    }

    public function storeProduct(Request $request)
    {
        $imageUrl = $request->input('image_url');

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $target = public_path('uploads/products');

            File::ensureDirectoryExists($target);
            $file->move($target, $filename);

            $imageUrl = url('/uploads/products/' . $filename);
        }

        $id = DB::table('products')->insertGetId([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'price' => $request->input('price'),
            'base_stock' => $request->input('base_stock', 0),
            'category' => $request->input('category'),
            'size' => $request->input('size'),
            'image_url' => $imageUrl,
            'created_at' => now(),
        ]);

        return response()->json(DB::table('products')->where('id', $id)->first(), 201);
    }

    public function inventoryLogs()
    {
        return DB::table('inventory_logs as il')
            ->join('products as p', 'il.product_id', '=', 'p.id')
            ->select('il.*', 'p.name as product_name')
            ->orderByDesc('il.timestamp')
            ->get();
    }

    public function storeInventoryLog(Request $request)
    {
        $log = DB::transaction(function () use ($request) {
            $id = DB::table('inventory_logs')->insertGetId([
                'product_id' => $request->input('product_id'),
                'type' => $request->input('type'),
                'quantity' => $request->input('quantity'),
                'reason' => $request->input('reason'),
                'timestamp' => now(),
            ]);

            $quantity = (int) $request->input('quantity');
            $stockChange = $request->input('type') === 'IN' ? $quantity : -$quantity;

            DB::table('products')
                ->where('id', $request->input('product_id'))
                ->increment('base_stock', $stockChange);

            return DB::table('inventory_logs')->where('id', $id)->first();
        });

        return response()->json($log, 201);
    }

    public function production()
    {
        return DB::table('production_orders as po')
            ->join('products as p', 'po.product_id', '=', 'p.id')
            ->select('po.*', 'p.name as product_name')
            ->orderByDesc('po.created_at')
            ->get();
    }

    public function storeProduction(Request $request)
    {
        $id = DB::table('production_orders')->insertGetId([
            'product_id' => $request->input('product_id'),
            'quantity' => $request->input('quantity'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'status' => 'queued',
            'created_at' => now(),
        ]);

        return response()->json(DB::table('production_orders')->where('id', $id)->first(), 201);
    }

    public function updateProduction(Request $request, int $id)
    {
        $order = DB::transaction(function () use ($request, $id) {
            DB::table('production_orders')
                ->where('id', $id)
                ->update(['status' => $request->input('status')]);

            $order = DB::table('production_orders')->where('id', $id)->first();

            if ($order && $request->input('status') === 'completed') {
                DB::table('inventory_logs')->insert([
                    'product_id' => $order->product_id,
                    'type' => 'IN',
                    'quantity' => $order->quantity,
                    'reason' => 'production completed',
                    'timestamp' => now(),
                ]);

                DB::table('products')
                    ->where('id', $order->product_id)
                    ->increment('base_stock', (int) $order->quantity);
            }

            return $order;
        });

        return response()->json($order);
    }

    public function orders()
    {
        return DB::table('orders as o')
            ->join('users as u', 'o.user_id', '=', 'u.id')
            ->select('o.*', 'u.name as customer_name')
            ->orderByDesc('o.created_at')
            ->get();
    }

    public function storeOrder(Request $request)
    {
        $orderId = DB::transaction(function () use ($request) {
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $request->input('user_id'),
                'total_amount' => $request->input('total_amount'),
                'shipping_address' => $request->input('shipping_address'),
                'status' => 'paid',
                'created_at' => now(),
            ]);

            foreach ($request->input('items', []) as $item) {
                DB::table('order_items')->insert([
                    'order_id' => $orderId,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                DB::table('products')
                    ->where('id', $item['id'])
                    ->decrement('base_stock', (int) $item['quantity']);

                DB::table('inventory_logs')->insert([
                    'product_id' => $item['id'],
                    'type' => 'OUT',
                    'quantity' => $item['quantity'],
                    'reason' => "Order #{$orderId} purchase",
                    'timestamp' => now(),
                ]);
            }

            return $orderId;
        });

        return response()->json([
            'message' => 'Order created successfully',
            'orderId' => $orderId,
        ], 201);
    }

    public function userOrders(int $id)
    {
        return DB::table('orders')
            ->where('user_id', $id)
            ->orderByDesc('created_at')
            ->get();
    }

    public function overview()
    {
        $recentLogs = DB::table('inventory_logs as il')
            ->join('products as p', 'il.product_id', '=', 'p.id')
            ->select('il.*', 'p.name as product_name')
            ->orderByDesc('il.timestamp')
            ->limit(5)
            ->get();

        return response()->json([
            'totalProducts' => (int) DB::table('products')->count(),
            'totalUsers' => (int) DB::table('users')->count(),
            'totalStock' => (int) DB::table('products')->sum('base_stock'),
            'recentLogs' => $recentLogs,
            'revenue' => 12500000,
        ]);
    }
}
