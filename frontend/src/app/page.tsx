import AnalyticsCards from "@/components/AnalyticsCards";
import UploadZone from "@/components/UploadZone";
import FileList from "@/components/FileList";
import DataVisualization from "@/components/DataVisualization";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden text-slate-50">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              SEFS Dashboard
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Smart Encrypted File System</p>
          </div>
          <div className="hidden sm:flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-300 text-nowrap">System Secure</span>
          </div>
        </header>

        <section>
          <AnalyticsCards />
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center">
            System Activity & Encrypted Workflow
          </h2>
          <DataVisualization />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-slate-100 flex items-center">
                Upload Data
              </h2>
              <UploadZone />
            </div>
            
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
              <h3 className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">How it works</h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 mt-0.5 text-xs">1</span>
                  <span>Upload a file using the dropzone.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 mt-0.5 text-xs">2</span>
                  <span>The backend analyzes classification heuristics.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mr-3 mt-0.5 text-xs">3</span>
                  <span><strong className="text-slate-200">HIGH sensitivity</strong> files are asynchronously encrypted using AES via Fernet.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-3 text-slate-100">
              Recent File Activity
            </h2>
            <FileList />
          </section>
        </div>
      </div>
    </main>
  );
}
