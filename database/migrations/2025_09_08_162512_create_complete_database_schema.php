<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create users table with complete schema including role system (no tokens, no sessions)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('username')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'cashier', 'customer'])->default('customer');
            $table->timestamps();
        });

        // Create jobs table
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        // Create job batches table
        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        // Create failed jobs table
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });

        // Create products table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->enum('type', ['pcs', 'kg', 'width*height']);
            $table->decimal('width', 8, 2)->nullable();
            $table->decimal('height', 8, 2)->nullable();
            $table->timestamps();
        });

        // Create transactions table
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cashier_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['paid', 'debt'])->default('debt');
            $table->enum('type', ['transaction', 'offer'])->default('transaction');
            $table->enum('offer_status', ['pending', 'accepted_paid', 'accepted_debt', 'rejected'])->nullable();
            $table->text('notes')->nullable();
            $table->json('items')->nullable(); // Store order items as JSON
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2);
            $table->timestamp('transaction_date')->useCurrent();
            $table->timestamps();
        });

        // Create business settings table
        Schema::create('business_settings', function (Blueprint $table) {
            $table->id();
                $table->string('company_name')->default('Haji Printing');
            $table->string('company_slogan')->nullable();
            $table->text('description')->nullable();
            $table->string('primary_phone', 20)->nullable();
            $table->string('secondary_phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('country', 100)->nullable();
            $table->timestamps();
        });

        // Create invoice settings table
        Schema::create('invoice_settings', function (Blueprint $table) {
            $table->id();
            $table->string('header_color', 7)->default('#f97316');
            $table->string('footer_color', 7)->default('#f97316');
            $table->string('table_header_color', 7)->default('#f97316');
            $table->string('primary_font', 50)->default('Arial');
            $table->integer('font_size_base')->default(12);
            $table->string('font_weight', 10)->default('400');
            $table->integer('logo_width')->default(90);
            $table->integer('logo_height')->default(90);
            $table->string('logo_url')->nullable();
                $table->string('company_title', 100)->default('INVOICE');
                $table->string('company_name', 100)->default('Haji Printing');
            $table->text('company_address')->nullable();
            $table->string('company_phone_1', 50)->nullable();
            $table->string('company_phone_2', 50)->nullable();
            $table->string('company_email', 100)->nullable();
            $table->string('company_website', 100)->nullable();
            $table->integer('header_height')->default(60);
            $table->integer('footer_height')->default(40);
            $table->boolean('show_logo')->default(true);
            $table->boolean('show_company_info')->default(true);
            $table->boolean('show_date_time')->default(true);
            $table->timestamps();
        });

        // Create posts table
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('image_path')->nullable();
            $table->timestamps();
        });

        // Create temporary invoice links table
        Schema::create('temporary_invoice_links', function (Blueprint $table) {
            $table->id();
            $table->string('temp_id')->unique();
            $table->json('transaction_data');
            $table->timestamp('expires_at');
            $table->boolean('is_used')->default(false);
            $table->integer('access_count')->default(0);
            $table->timestamps();
            
            $table->index(['temp_id', 'expires_at']);
            $table->index('expires_at');
        });

        // Add performance indexes to existing tables
        // Add indexes to transactions table
        Schema::table('transactions', function (Blueprint $table) {
            $table->index(['customer_id', 'status'], 'transactions_customer_status_index');
            $table->index('created_at', 'transactions_created_at_index');
            $table->index('status', 'transactions_status_index');

            // Additional search performance indexes
            $table->index('order_id', 'transactions_order_id_search_index');
            $table->index(['transaction_date', 'status'], 'transactions_date_status_index');
            $table->index(['customer_id', 'transaction_date'], 'transactions_customer_date_index');
            $table->index('grand_total', 'transactions_amount_index');
        });

        // Add indexes to users table
        Schema::table('users', function (Blueprint $table) {
            $table->index('role', 'users_role_index');
            $table->index(['email', 'role'], 'users_email_role_index');

            // Additional search performance indexes
            $table->index(['role', 'name'], 'users_role_name_index');
            $table->index('phone', 'users_phone_index');
        });

        // Add indexes to products table
        Schema::table('products', function (Blueprint $table) {
            $table->index('name', 'products_name_index');
            $table->index('type', 'products_type_index');

            // Additional search performance indexes
            $table->index(['type', 'name'], 'products_type_name_index');
            $table->index(['price', 'name'], 'products_price_name_index');
            $table->index(['created_at', 'name'], 'products_created_name_index');
            $table->index('price', 'products_price_range_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop performance indexes
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_name_index');
            $table->dropIndex('products_type_index');
            $table->dropIndex('products_type_name_index');
            $table->dropIndex('products_price_name_index');
            $table->dropIndex('products_created_name_index');
            $table->dropIndex('products_price_range_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_index');
            $table->dropIndex('users_email_role_index');
            $table->dropIndex('users_role_name_index');
            $table->dropIndex('users_phone_index');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_customer_status_index');
            $table->dropIndex('transactions_created_at_index');
            $table->dropIndex('transactions_status_index');
            $table->dropIndex('transactions_order_id_search_index');
            $table->dropIndex('transactions_date_status_index');
            $table->dropIndex('transactions_customer_date_index');
            $table->dropIndex('transactions_amount_index');
        });

        // Drop all tables
        Schema::dropIfExists('temporary_invoice_links');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('invoice_settings');
        Schema::dropIfExists('business_settings');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('products');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('users');
    }
};
