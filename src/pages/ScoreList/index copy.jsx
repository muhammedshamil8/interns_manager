import { useState, useEffect, useRef } from "react";
import { fetchRecords } from "@/utils/airtableService";
import { Badge } from "@/components/ui/badge";
import autoAnimate from '@formkit/auto-animate'
import { NavLink } from "react-router-dom";

function ScoreList() {
    const [memberList, setMemberList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const parent = useRef(null)

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
    }, [parent])

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
                const Record = Records.sort((a, b) => b.fields.Points - a.fields.Points);
                setMemberList(Record);
                console.log(Record);
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
        <div className=" bg-gray-50 min-h-screen flex flex-col justify-between">
            <main className="py-6 px-2 md:p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-6">Members Pointboard</h1>
                <NavLink to="/" className="text-blue-500 hover:underline absolute top-4 right-4">View Events</NavLink>
                <div className="mb-6 max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <ul className="bg-white rounded-xl shadow-lg p-4 max-w-[1200px] mx-auto">
                    <li className="flex flex-wrap items-center border-b font-semibold text-gray-700 pb-6 mb-4">
                        <div className="flex-shrink-0 w-1/12 md:w-1/12 flex justify-center items-center h-24 rotate-90 md:rotate-0">Rank</div>
                        <div className="flex-1 flex justify-center md:justify-start items-center mt-6 md:mt-0 rotate-90 md:rotate-0 w-[20px]">
                            <span className="whitespace-nowrap flex md:flex-row gap-2 flex-col-reverse">
                                <span>Name | Role |</span>
                                <span> Department</span>
                            </span>
                        </div>
                        <div className="flex-shrink-0 w-1/6 md:w-1/6 flex flex-row items-center justify-center h-24 rotate-90 md:rotate-0 pl-4 md:pl-0">
                            <span className="whitespace-nowrap">Coordinated</span>
                            <span className="relative flex items-center justify-center h-3 w-3 ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                            </span>
                        </div>
                        <div className="flex-shrink-0 w-1/6 md:w-1/6 flex flex-row items-center justify-center h-24 rotate-90 md:rotate-0 pl-4 md:pl-0">
                            <span className="whitespace-nowrap">Volunteered</span>
                            <span className="relative flex items-center justify-center h-3 w-3 ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
                            </span>
                        </div>
                        <div className="flex-shrink-0 w-1/12 md:w-1/12 flex flex-row items-center justify-center h-24 rotate-90 md:rotate-0 ">
                            <span className="whitespace-nowrap">Attended</span>
                            <span className="relative flex items-center justify-center h-3 w-3 ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                            </span>
                        </div>
                        <div className="flex-shrink-0 w-1/12 md:w-1/12 flex flex-row items-center justify-center h-24 rotate-90 md:rotate-0">
                            <span className="whitespace-nowrap">Bonus p</span>
                            <span className="relative flex items-center justify-center h-3 w-3 ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-600"></span>
                            </span>
                        </div>
                        <div className="flex-shrink-0 w-1/12 md:w-1/12 flex flex-row items-center justify-center h-24 rotate-90 md:rotate-0">
                            <span className="whitespace-nowrap">Point</span>
                            <span className="relative flex items-center justify-center h-3 w-3 ml-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-600 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span>
                            </span>
                        </div>
                    </li>

                    {loading ? (
                        <li className="text-center text-gray-500 py-6">Loading...</li>
                    ) : (
                        filteredList.map((record, index) => (
                            <li
                                key={record.id}
                                className="flex flex-wrap items-center border-b last:border-none p-2 py-6 md:p-4 relative"
                            >
                                {record.fields.Active && (
                                    <div className="absolute left-0 top-0 select-none">
                                        <Badge className="bg-green-600 text-white text-xs hover:bg-green-500">Active</Badge>
                                    </div>
                                )}
                                <div className="flex-shrink-0 w-1/12">
                                    <span className="text-xl text-gray-500 font-bold">{index + 1}</span>
                                </div>
                                <div className="flex-1 w-4/12">
                                    <h2 className="text-md font-medium text-gray-900">
                                        {record.fields.name} <span className="text-sm">({record.fields.Batch})</span>
                                    </h2>
                                    <p className="text-sm text-gray-500">{record.fields.Position} - {record.fields.department}</p>
                                </div>
                                <div className="flex-shrink-0 w-1/6 text-center">
                                    <p className="text-xl font-bold text-blue-600">{record.fields.Events_Coordinated}</p>
                                </div>
                                <div className="flex-shrink-0 w-1/6 text-center">
                                    <p className="text-xl font-bold text-orange-600">{record.fields.Events_Volunteer}</p>
                                </div>
                                <div className="flex-shrink-0 w-1/12 text-center">
                                    <p className="text-xl font-bold text-green-600">{record.fields.Events_Attended}</p>
                                </div>
                                <div className="flex-shrink-0 w-1/12 text-center">
                                    <p className="text-xl font-bold text-yellow-600">{record.fields.Bonus_points}</p>
                                </div>
                                <div className="flex-shrink-0 w-1/12 text-center">
                                    <p className="text-xl font-bold text-purple-600">{record.fields.Points}</p>
                                </div>
                            </li>
                        ))
                    )}

                    {!loading && filteredList.length === 0 && (
                        <li className="text-center text-gray-500 py-6">No members found</li>
                    )}
                </ul>
                        
            </main>
            <footer className="text-sm py-4 bottom-0 mx-auto w-full text-center bg-gray-100 text-gray-800 border-t border-gray-300">
                <p className="m-0">Crafted with ❤️ by the Connnect Tech Team</p>
            </footer>
        </div>
    );
}

export default ScoreList;
