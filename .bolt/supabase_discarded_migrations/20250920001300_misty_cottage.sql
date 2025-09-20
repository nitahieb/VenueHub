@@ .. @@
 -- Create reviews table if it doesn't exist
-CREATE TABLE reviews (
+CREATE TABLE IF NOT EXISTS reviews (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   venue_id uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
   user_name text NOT NULL,
@@ .. @@
 );
 
 -- Enable RLS
-ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
+DO $$ 
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_class c 
+    JOIN pg_namespace n ON n.oid = c.relnamespace 
+    WHERE c.relname = 'reviews' AND n.nspname = 'public' AND c.relrowsecurity = true
+  ) THEN
+    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
+  END IF;
+END $$;
 
 -- Create policies if they don't exist
-CREATE POLICY "Anyone can read reviews"
-  ON reviews
-  FOR SELECT
-  TO anon, authenticated
-  USING (true);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'reviews' AND policyname = 'Anyone can read reviews'
+  ) THEN
+    CREATE POLICY "Anyone can read reviews"
+      ON reviews
+      FOR SELECT
+      TO anon, authenticated
+      USING (true);
+  END IF;
+END $$;
 
-CREATE POLICY "Authenticated users can insert reviews"
-  ON reviews
-  FOR INSERT
-  TO authenticated
-  WITH CHECK (true);
+DO $$
+BEGIN
+  IF NOT EXISTS (
+    SELECT 1 FROM pg_policies 
+    WHERE tablename = 'reviews' AND policyname = 'Authenticated users can insert reviews'
+  ) THEN
+    CREATE POLICY "Authenticated users can insert reviews"
+      ON reviews
+      FOR INSERT
+      TO authenticated
+      WITH CHECK (true);
+  END IF;
+END $$;