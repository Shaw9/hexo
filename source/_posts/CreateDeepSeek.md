---
title: 创建DeepSeek本地部署Python版本
date: 2025-08-07 18:18:13
tag:
    - AI
categories:
    - 开发编程
---

> 　最近想创建一个AI翻译机器人，加截图翻译，虽然效果不太好，但是机器人确实搞好了，记录下

# 安装依赖（主要难点）
1. 首先确认`Python`的版本不要太新，我这里是 `3.11`
2. 打开`PyTorch`官网 https://pytorch.org/get-started/locally/
3. 下载`PyTorch`官网显示的Cuba版本 https://developer.nvidia.com/cuda-toolkit-archive
4. 安装`PyTorch`官网显示的命令
## `llama_cpp` 库 安装
```powershell
$env:CMAKE_ARGS="-DGGML_CUDA=on"
pip install llama-cpp-python[server] --upgrade --force-reinstall --no-cache-dir
```
如果你出问题了，请检查`CUDA`,`Python`版本,`PyTorch`版本是否匹配

## 下载DeepSeek模型
一般从 https://huggingface.co/deepseek-ai/deepseek-coder-7b-instruct-GGUF 获取
国内可以用：
https://www.modelscope.cn/models/unsloth/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/master/DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf
https://www.modelscope.cn/models/unsloth/DeepSeek-R1-Distill-Qwen-14B-GGUF/resolve/master/DeepSeek-R1-Distill-Qwen-14B-Q4_K_M.gguf

## 代码
```python
import time
from llama_cpp import Llama


# ===== 硬件优化配置 =====
MODEL_PATH = r"models\DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf"
GPU_LAYERS = 30  # RTX 3050 Ti 推荐30层
CPU_THREADS = 20   # 3900X分配6线程
MAX_TOKENS = 4096 # 最大生成长度

# ===== R1专用参数 =====
SYSTEM_PROMPT = "你是一个专业的翻译官，你的任务是将下面提供给你的文本翻译成可供中国人阅读的中文，只输出翻译结果，不要其他额外的输出"
# ===== 模型初始化 =====
print("⏳ 正在加载DeepSeek-R1模型，请稍候...")
start_time = time.time()

llm = Llama(
    model_path=MODEL_PATH,
    n_gpu_layers=30,
    n_threads=20,
    n_ctx=4096,
    n_batch=512,
    verbose=True
)

load_time = time.time() - start_time
print(f"✅ 模型加载完成! 耗时: {load_time:.1f}秒")

# ===== R1专用对话格式 =====
def format_r1_prompt(user_input):
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_input}
    ]

# ===== 流式输出函数 =====
def generate_response(prompt):
    try:
        response = llm.create_chat_completion(
            messages=format_r1_prompt(prompt),
            max_tokens=MAX_TOKENS,
            temperature=0.7,
            stop=["<|im_end|>"],
            stream=True
        )
        
        full_response = ""
        for chunk in response:
            delta = chunk['choices'][0]['delta']
            if 'content' in delta:
                content = delta['content']
                print(content, end='', flush=True)
                full_response += content
        return full_response
    except Exception as e:
        return f"❌ 生成错误: {str(e)}"

# ===== 主交互循环 =====
print("\n🤖 DeepSeek-R1助手已就绪（输入'exit'退出）")
print("💡 提示：R1是通用对话模型，适合各类问题\n")

while True:
    try:
        # 获取用户输入
        user_input = input("\n👤 您: ")
        
        if user_input.lower() == 'exit':
            print("🛑 助手已退出")
            break
        
        # 生成回复
        print("🤖 R1: ", end='', flush=True)
        start_gen = time.time()
        
        # 流式输出
        response = generate_response(user_input)
        
        # 性能统计
        gen_time = time.time() - start_gen
        tokens = len(llm.tokenize(response.encode()))
        print(f"\n⏱️ 生成耗时: {gen_time:.1f}s | 📝 令牌数: {tokens}")
        
    except KeyboardInterrupt:
        print("\n🛑 操作已中断")
        break

```