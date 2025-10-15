import time
import os

txt_file = "blog-posts/blog-list.txt"
js_file = "js/jobData.js"

def read_blog_list():
    try:
        with open(txt_file, 'r', encoding='utf-8') as f:
            lines = [line.strip() for line in f.readlines() if line.strip().endswith('.html')]
        return lines
    except FileNotFoundError:
        print(f"❌ {txt_file} not found!")
        return []

def update_jobdata_js(blog_files):
    try:
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        blog_array = '[\n    "' + '",\n    "'.join(blog_files) + '"\n]'
        
        start_marker = "// ===== AUTO-GENERATED: DO NOT EDIT MANUALLY =====\nwindow.AVAILABLE_BLOG_POSTS = "
        end_marker = ";\n// ===== END AUTO-GENERATED ====="
        
        if start_marker in content:
            before = content.split(start_marker)[0]
            after = content.split(end_marker)[1]
            new_content = before + start_marker + blog_array + end_marker + after
        else:
            new_content = start_marker + blog_array + end_marker + "\n\n" + content
        
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated jobData.js with {len(blog_files)} blog posts")
        return True
    except Exception as e:
        print(f"❌ Error updating jobData.js: {e}")
        return False

def main():
    print("🔄 Blog List Sync - Watching for changes...\n")
    last_modified = 0
    
    while True:
        try:
            current_modified = os.path.getmtime(txt_file)
            
            if current_modified != last_modified:
                print(f"\n📝 {txt_file} changed! Updating jobData.js...")
                blog_files = read_blog_list()
                if blog_files:
                    if update_jobdata_js(blog_files):
                        print(f"✅ Synced successfully! ({len(blog_files)} files)\n")
                last_modified = current_modified
            
            time.sleep(2)
            
        except KeyboardInterrupt:
            print("\n\n👋 Stopped watching. Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
