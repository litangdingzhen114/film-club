import json
import re

# Read 1.json
with open("/home/sunmaosun/my-awwwards-site/src/lib/1.json", "r", encoding="utf-8") as f:
    leifeng_raw = json.load(f)

# Hardcoded tags for Leifeng based on content
leifeng_tags = {
    1: ["班助支援", "志愿服务", "暖心经历"],
    2: ["手语教学", "沟通桥梁", "老人关怀"],
    3: ["听障榜样", "志愿服务", "自强不息"],
    4: ["互助陪伴", "校园温情", "责任担当"],
    5: ["同伴互助", "细节关怀", "校园风貌"],
    6: ["动物关爱", "无声善意", "互助前行"],
    7: ["志愿者", "细节微光", "食堂互助"],
    8: ["时代榜样", "精神传承", "观影感悟"],
    9: ["细节关怀", "同伴支持", "暖心陪伴"],
    10: ["无障碍服务", "志愿活动", "残健融合"],
    11: ["校园细节", "互助互爱", "春风化雨"],
    12: ["迎新服务", "志愿精神", "家乡代言"],
    13: ["西部计划", "青春奉献", "榜样力量"],
    14: ["暖心同桌", "细节互助", "同侪陪伴"],
    15: ["凡人微光", "互助精神", "街头温情"],
    16: ["榜样精神", "时代传承", "观影感悟"],
    17: ["辅警服务", "特教互助", "坚守担当"]
}

leifeng_articles = []
for item in leifeng_raw:
    # Build excerpt
    content = item.get("content", "")
    excerpt = content[:60] + "..." if len(content) > 60 else content
    tags = leifeng_tags.get(item["id"], ["雷锋精神", "特殊教育", "志愿服务"])
    
    leifeng_articles.append({
        "id": item["id"],
        "classInfo": item.get("class", ""),
        "author": item.get("author", ""),
        "title": item.get("title", ""),
        "excerpt": excerpt,
        "content": content,
        "tags": tags,
        "date": "2026-03-05"
    })

# Process data2.ts
with open("/home/sunmaosun/my-awwwards-site/src/lib/data2.ts", "r", encoding="utf-8") as f:
    data2_content = f.read()

# Extract FEATURED_DATA
import ast

def extract_array(array_name):
    pattern = r"const " + array_name + r"[\s:a-zA-Z\[\]]*=\s*(\[.*?\]);"
    match = re.search(pattern, data2_content, re.DOTALL)
    if not match:
        return []
    
    array_str = match.group(1)
    # clean up JS syntax to be JSON parsable
    array_str = re.sub(r'getRandomRating\(\)', '8.5', array_str)
    array_str = array_str.replace("UNIFIED_DATE", '"2025-12-01"')
    # replace unquoted keys
    array_str = re.sub(r'([{,]\s*)(\w+):', r'\1"\2":', array_str)
    # remove trailing commas
    array_str = re.sub(r',\s*}', '}', array_str)
    array_str = re.sub(r',\s*\]', ']', array_str)
    # Single quotes to double quotes (not full proof but often works)
    # wait, data2.ts uses backticks for content!
    # A simple regex to parse it might fail miserably. Let's write a nodeJS script instead!
    return array_str

