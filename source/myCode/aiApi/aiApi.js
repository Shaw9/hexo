async function callAiApi(msg, systemMsg = "你是人工智能助手") {
    const url = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    // sk-0B4TJVEIjNru4SSskFstS5hlR0c0LXuFrR7h0jESne64P1Kt
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer cb4a48df-2875-464a-890f-1f055b363e96'
    };
    const body = JSON.stringify({
        model: 'doubao-1-5-lite-32k-250115',
        messages: [
            { role: 'system', content: systemMsg },
            { role: 'user', content: msg }
        ]
    });

    try {
        const response = await fetch(url, { method: 'POST', headers, body });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('请求错误:', error);
        throw error;
    }
}

async function summarizeBlogPost(Doc, systemMsg = "你是一个专业的博客摘要助手，你的任务是根据博客内容，一句话总结出一个专业的摘要，200字左右，不输出markdown，只产生总结，不产生其他内容。以下为博客内容：") {

    let AiMsg = await callAiApi(Doc, systemMsg)
    return AiMsg.choices[0].message.content
}
/*
    功能：将HTML字符串转换为纯文本
    参数：html - 包含HTML标签的字符串
    返回值：纯文本字符串
*/
function htmlToTextUsingDOMParser(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}



if(document.querySelector("#article-container") != null){// 判断是否为博客文章界面
// 修改界面
let html = document.querySelector("#article-container").innerHTML
let text = htmlToTextUsingDOMParser(html)
summarizeBlogPost(text).then(res => {
    const postElement = document.querySelector("#post");
    if (postElement) {
        const divElement = document.createElement("div");
        divElement.id = "AItext";
        postElement.insertBefore(divElement, postElement.firstChild);

        const titleElement = document.createElement("p");
        titleElement.id = "AItextTitle";
        titleElement.innerHTML = "AI摘要";
        // 添加标题样式（可选）
        divElement.appendChild(titleElement);

        // 创建内容容器，避免覆盖标题
        const contentElement = document.createElement("div");
        res = "&nbsp;&nbsp;&nbsp;&nbsp;" + res
        contentElement.innerHTML = res;
        divElement.appendChild(contentElement);
    }
    console.log(res)
})
}