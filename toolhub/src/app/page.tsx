import Image from "next/image";

const CATEGORIES = [
  { id: "audio", name: "Audio", count: "2.3k", icon: "🎵" },
  { id: "video", name: "Video", count: "3.1k", icon: "🎬" },
  { id: "text", name: "Text", count: "5.8k", icon: "📝" },
  { id: "image", name: "Image", count: "4.2k", icon: "🖼" },
  { id: "data", name: "Data", count: "1.9k", icon: "📊" },
  { id: "api", name: "API", count: "6.7k", icon: "🔌" },
];

const FEATURED_TOOLS = [
  {
    id: "faster-whisper",
    name: "faster-whisper",
    description: "快速英文音频转文字，支持多语言模型",
    category: "audio",
    calls: "154k",
    rating: 4.8,
  },
  {
    id: "yt-dlp",
    name: "yt-dlp",
    description: "强大的视频下载工具，支持1000+网站",
    category: "video",
    calls: "230k",
    rating: 4.9,
  },
  {
    id: "puppeteer",
    name: "puppeteer",
    description: "浏览器自动化控制，截图/爬虫/测试",
    category: "api",
    calls: "890k",
    rating: 4.7,
  },
  {
    id: "ffmpeg",
    name: "ffmpeg",
    description: "音视频处理全能工具，转换/剪辑/编码",
    category: "video",
    calls: "1.2M",
    rating: 4.9,
  },
  {
    id: "tesseract",
    name: "tesseract",
    description: "OCR文字识别，支持多语言",
    category: "image",
    calls: "67k",
    rating: 4.5,
  },
  {
    id: "jq",
    name: "jq",
    description: "JSON数据处理神器，命令行JSON解析",
    category: "data",
    calls: "445k",
    rating: 4.8,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D3B3B]">
      {/* Header */}
      <header className="border-b border-[#2A5E5E]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E67E22] rounded-lg flex items-center justify-center font-bold text-xl text-[#0D3B3B]">
              T
            </div>
            <span className="text-2xl font-bold text-[#E67E22]">ToolHub</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="/marketplace" className="text-[#8FBBBB] hover:text-[#E67E22] transition-colors">
              Marketplace
            </a>
            <a href="/docs" className="text-[#8FBBBB] hover:text-[#E67E22] transition-colors">
              Docs
            </a>
            <a href="/agent" className="text-[#8FBBBB] hover:text-[#E67E22] transition-colors">
              AI Agent
            </a>
            <a href="/developer" className="text-[#8FBBBB] hover:text-[#E67E22] transition-colors">
              Developer
            </a>
            <button className="bg-[#E67E22] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#F39C12] transition-colors">
              Connect Wallet
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-[#E67E22] mb-6 leading-tight">
            AI Agent&apos;s Marketplace v2
          </h1>
          <p className="text-xl text-[#8FBBBB] mb-4 leading-relaxed">
            让 AI 工具被 AI 发现、购买、使用。
            <br />
            全球首个纯 AI-Agent 市场的工具平台。
          </p>
          <p className="text-[#5A8A8A] text-sm mb-8 code-font">
            {`Tools = { discovery: "semantic", purchase: "auto", execution: "one-click" }`}
          </p>
          <div className="flex gap-4">
            <button className="bg-[#E67E22] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#F39C12] transition-colors">
              For AI Agents
            </button>
            <button className="border border-[#E67E22] text-[#E67E22] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#E67E22] hover:text-white transition-colors">
              Submit Tool
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-12 mt-16">
          <div>
            <div className="text-4xl font-bold text-[#E67E22]">52.7k</div>
            <div className="text-[#8FBBBB]">AI-Ready Tools</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#E67E22]">180k</div>
            <div className="text-[#8FBBBB]">AI Agents</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#E67E22]">12M</div>
            <div className="text-[#8FBBBB]">Total Calls</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Categories</h2>
        <div className="grid grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`/marketplace?category=${cat.id}`}
              className="bg-[#0F4242] border border-[#2A5E5E] rounded-xl p-6 text-center hover:border-[#E67E22] transition-colors group"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className="text-white font-medium mb-1">{cat.name}</div>
              <div className="text-[#E67E22] text-sm">{cat.count}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Tools</h2>
          <a href="/marketplace" className="text-[#E67E22] hover:underline">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {FEATURED_TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={`/tool/${tool.id}`}
              className="tool-card bg-[#0F4242] border border-[#2A5E5E] rounded-xl p-6 hover:border-[#E67E22]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#1A4D4D] px-3 py-1 rounded text-xs text-[#E67E22]">
                  {tool.category}
                </div>
                <div className="text-[#F39C12] text-sm">★ {tool.rating}</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 code-font">
                {tool.name}
              </h3>
              <p className="text-[#8FBBBB] text-sm mb-4">{tool.description}</p>
              <div className="text-xs text-[#5A8A8A]">
                {tool.calls} calls
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* AI-Ready YAML Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#0F4242] border border-[#2A5E5E] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-[#E67E22] mb-4">
            AI-Ready Tool Format
          </h2>
          <p className="text-[#8FBBBB] mb-6">
            Every tool comes with standardized YAML description for AI agents to understand capabilities.
          </p>
          <pre className="code-font bg-[#0D3B3B] border border-[#2A5E5E] rounded-lg p-6 text-sm text-[#F39C12] overflow-x-auto">
{`tool:
  id: "faster-whisper"
  name: "faster-whisper"
  capabilities:
    input: ["audio/*", "video/*"]
    output: ["text", "srt"]
    language: ["en", "zh", "ja"]
  cli:
    install: "pip install faster-whisper"
    usage: "faster-whisper --input {file} --model {model}"
  api:
    endpoint: "https://api.toolhub.ai/transcribe"
    method: "POST"
  pricing:
    free_tier: 100
    per_call: 0.01`}
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A5E5E] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="text-[#5A8A8A] text-sm">
            © 2026 ToolHub. AI Agent Marketplace.
          </div>
          <div className="flex gap-6 text-[#8FBBBB] text-sm">
            <a href="/docs" className="hover:text-[#E67E22]">Documentation</a>
            <a href="/terms" className="hover:text-[#E67E22]">Terms</a>
            <a href="/privacy" className="hover:text-[#E67E22]">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}