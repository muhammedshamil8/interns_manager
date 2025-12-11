import { useState, useEffect, useRef } from "react";
import { fetchRecords } from "@/utils/airtableService";
import { Badge } from "@/components/ui/badge";
import autoAnimate from "@formkit/auto-animate";
import { NavLink } from "react-router-dom";

function ScoreList() {
    const [memberList, setMemberList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tableName = "members";
                const filterBy = "";
                const sortField = "auto";
                const sortDirection = "desc";
                const Records = await fetchRecords(
                    tableName,
                    filterBy,
                    sortField,
                    sortDirection
                );
                const sortedRecords = Records.sort((a, b) => b.fields.Points - a.fields.Points);
                const rankedRecords = sortedRecords.map((record, index) => ({
                    ...record,
                    rank: index + 1,
                }));
                setMemberList(rankedRecords);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredList = memberList.filter((record) =>
        record.fields.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col justify-between text-gray-200">
            <main className="p-6 px-2 md:px-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-100 mt-6">Members Pointboard</h1>
                <NavLink to="/" className="text-blue-400 hover:underline absolute top-4 right-4">View Events</NavLink>
                <div className="mb-6 max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-3 border border-gray-700 bg-gray-800 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-800 text-gray-200"
                    />
                </div>
                <ul className="bg-gray-800 rounded-xl shadow-lg p-4 pt-0 md:pt-4 max-w-4xl mx-auto" ref={parent}>
                    <li className="grid grid-cols-12 gap-4 md:gap-[30px] border-b font-semibold text-gray-400 md:pb-6 md:p-4 pb-10">
                        <div className="col-span-1 flex justify-between md:justify-center items-center rotate-90 md:rotate-0 md:h-auto h-24 -mt-3 md:mt-0">
                            <span className="whitespace-nowrap">Rank</span>
                        </div>
                        <div className="col-span-3 flex md:justify-start justify-center items-center mt-[28px] md:mt-0 rotate-90 md:rotate-0 md:h-auto h-24">
                            <span className="whitespace-nowrap flex flex-col-reverse md:flex-row gap-2"><span>Name | Role |</span><span> Department</span></span>
                        </div>
                        <div className="col-span-2 flex justify-between md:justify-center items-center rotate-90 md:rotate-0 md:h-auto h-24 gap-4 mt-0.5 md:mt-0">
                            <span className="whitespace-nowrap">Coordinated</span>
                            <span className="relative flex h-3 w-3 -mt-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-400"></span>
                            </span>
                        </div>
                        <div className="col-span-2 flex justify-between md:justify-center items-center rotate-90 md:rotate-0 md:h-auto h-24 gap-4 mt-0.5 md:mt-0">
                            <span className="whitespace-nowrap">Volunteered</span>
                            <span className="relative flex h-3 w-3 -mt-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                            </span>
                        </div>
                        <div className="col-span-2 flex justify-between md:justify-center items-center rotate-90 md:rotate-0 md:h-auto h-24 md:gap-4 gap-[39px] mt-0.5 md:mt-0">
                            <span className="whitespace-nowrap">Attended</span>
                            <span className="relative flex h-3 w-3 -mt-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        </div>
                        <div className="col-span-2 flex justify-between md:justify-center items-center rotate-90 md:rotate-0 md:h-auto h-24 mt-0.5 md:mt-0 md:gap-4 gap-[68px]">
                            <span className="whitespace-nowrap">Points</span>
                            <span className="relative flex h-3 w-3 -mt-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                            </span>
                        </div>
                    </li>

                    {loading ? (
                        <li className="text-center text-gray-400 py-6">Loading...</li>
                    ) : (
                        filteredList.map((record, index) => (
                            <li
                                key={record.id}
                                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 last:border-none items-center relative pl-0 md:pl-2"
                            >
                                {record.fields.Active && (
                                    <div className="absolute right-0 top-1 select-none">
                                        <Badge className="bg-green-500 text-white text-[10px] hover:bg-green-400">Active</Badge>
                                    </div>
                                )}
                                <div className="col-span-1 text-center">
                                    <p className="text-xl font-bold text-gray-300">{record.rank}</p>
                                </div>
                                <div className="col-span-3">
                                    <h2 className="text-lg font-medium text-gray-100">
                                        {record.fields.name} <span className="text-sm">({record.fields.Batch})</span>
                                    </h2>
                                    <p className="text-sm text-gray-400">{record.fields.Position} - {record.fields.department}</p>
                                </div>
                                <div className="col-span-2 text-center">
                                    <p className="text-xl font-bold text-blue-400">{record.fields.Events_Coordinated}</p>
                                </div>
                                <div className="col-span-2 text-center">
                                    <p className="text-xl font-bold text-orange-400">{record.fields.Events_Volunteer}</p>
                                </div>
                                <div className="col-span-2 text-center">
                                    <p className="text-xl font-bold text-green-400">{record.fields.Events_Attended}</p>
                                </div>
                                <div className="col-span-2 text-center">
                                    <p className="text-xl font-bold text-purple-400">{record.fields.Points}</p>
                                </div>
                            </li>
                        ))
                    )}

                    {!loading && filteredList.length === 0 && (
                        <li className="text-center text-gray-400 py-6">No members found</li>
                    )}
                </ul>
            </main>
            <footer className="text-sm py-4 bottom-0 mx-auto w-full text-center text-gray-500">
                <p className="m-0">Crafted with ❤️ by the Connnect Tech Team</p>
            </footer>
        </div>
    );
}

export default ScoreList;
