export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔥 Latest Hot Takes</h1>
      <div className="grid gap-4">
        {[1, 2, 3].map((id) => (
          <div key={id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Hot Take #{id}</h2>
            <p className="text-gray-600">This is a placeholder hot take for demo purposes.</p>
          </div>
        ))}
      </div>
    </div>
  );
}