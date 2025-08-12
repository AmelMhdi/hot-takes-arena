export default function Leaderboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                🏆 Leaderboard
            </h1>

            <table>
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Rank</th>
                        <th className="border border-gray-300 p-2">Player</th>
                        <th className="border border-gray-300 p-2">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3].map((rank) => (
                        <tr key={rank} className="text-center">
                            <td className="border border-gray-300 p-2">{rank}</td>
                            <td className="border border-gray-300 p-2">Player {rank}</td>
                            <td className="border border-gray-300 p-2">{rank * 100}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}