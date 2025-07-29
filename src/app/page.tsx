import PetModelViewer from '../components/PetModelViewer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Pet Generator & Model Exporter
        </h1>
        <p className="text-white/80 text-center mb-12 max-w-2xl mx-auto">
          Tạo và xuất pet models cho game development. Hỗ trợ nhiều định dạng export 
          như JSON, XML, CSV, Unity C#, và Unreal Engine C++.
        </p>
        
        <PetModelViewer />
      </div>
    </main>
  );
}
