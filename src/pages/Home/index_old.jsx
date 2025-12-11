import { useState, useEffect, useRef } from "react";
import { fetchRecords } from "@/utils/airtableService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { NavLink } from "react-router-dom";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const SkeletonLoader = ({ count }) => {
    return (
        <div className="flex w-full flex-wrap gap-4 mx-auto">
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton
                    key={index}
                    className="h-[360px] min-w-[400px] rounded-xl bg-slate-600 mx-auto"
                />
            ))}
        </div>
    );
};


function Home() {
    const [eventList, setEventList] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expanded, setExpanded] = useState({ coordinators: {}, volunteers: {}, attendees: {} });
    const [parent, enableAnimations] = useAutoAnimate(/* optional config */)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const tableName = "Events";
                const filterBy = "";
                const sortField = "auto";
                const sortDirection = "desc";
                const records = await fetchRecords(
                    tableName,
                    filterBy,
                    sortField,
                    sortDirection
                );
                setEventList(records);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchMembers = async () => {
            try {
                const tableName = "members";
                const filterBy = "";
                const sortField = "auto";
                const sortDirection = "desc";
                const records = await fetchRecords(
                    tableName,
                    filterBy,
                    sortField,
                    sortDirection
                );
                const memberDetails = records.map(record => ({
                    id: record.id,
                    name: record.fields.name,
                    department: record.fields.department,
                    batch: record.fields.Batch
                }));
                setMembersList(memberDetails);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvents();
        fetchMembers();
    }, []);

    // Utility function to get member details by ID
    const getMemberDetailsById = (id) => {
        const member = membersList.find((record) => record.id === id);
        return member ? { name: member.name, department: member.department, batch: member.batch } : { name: "Unknown Member", department: "Unknown Department", batch: "Unknown Batch" };
    };

    // Utility function to handle view more/less
    const handleViewToggle = (type, index) => {
        setExpanded(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [index]: !prev[type][index]
            }
        }));
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredList = eventList.filter((record) =>
        record.fields.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className=" bg-gray-900 min-h-screen flex flex-col justify-between">
            <main className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-white mt-6">Connect EVENTS</h1>
                <NavLink to="/scoreboard" className="text-white hover:underline absolute top-5 right-5">View Scoreboard</NavLink>
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search events by name"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full md:w-1/2 lg:w-1/3 p-3 border bg-gray-800 text-white border-gray-500 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                </div>
                <div ref={parent}>

                    {loading ? (
                        <>
                            <SkeletonLoader count={4} />
                        </>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" ref={parent}>
                            {filteredList.map((record) => {
                                const coordinators = record.fields.Coordinators || [];
                                const volunteers = record.fields.Volunteers || [];
                                const attendees = record.fields.Attendees || [];

                                return (    
                                    <div
                                        key={record.id}
                                        className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col relative"
                                    >
                                        {record.fields.Image && (
                                            <img
                                                src={record.fields.Image[0].url}
                                                alt={record.fields.Name}
                                                className="w-full h-40 object-cover rounded-lg mb-4"
                                            />
                                        )}
                                        <div className="flex flex-col flex-grow">
                                            <h2 className="text-xl font-semibold text-white mb-2">{record.fields.Name}</h2>
                                            <p className="text-sm text-slate-200 mb-2">
                                                <span className="font-semibold">{record.fields.Type}</span> - {record.fields.Venue}
                                            </p>
                                            <p className="text-sm text-slate-200 mb-2">
                                                <span className="font-semibold">Mode:</span> {record.fields.Mode}
                                            </p>
                                            <p className="text-sm text-slate-200 mb-4">
                                                <span className="font-semibold">Date:</span> {record.fields.Date}
                                            </p>
                                            <p className="text-sm text-white mb-4">
                                                {record.fields.Description}
                                            </p>
                                        </div>

                                        <Sheet className="!bg-gray-900">
                                            <SheetTrigger asChild>
                                                <Button variant="outline" className="w-full bg-gray-900 !text-white font-medium py-2 rounded-lg hover:bg-gray-700 transition-all ease-in-out border-gray-500">View Details</Button>
                                            </SheetTrigger>
                                            <SheetContent className="!bg-gray-900 min-w-full md:min-w-[40%] flex flex-col justify-between overflow-auto">
                                                <div>
                                                    <SheetHeader>
                                                        <SheetTitle className="text-white">{record.fields.Name}</SheetTitle>
                                                        <SheetDescription>
                                                            Here you can view the details of the event and the members associated with it.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <>
                                                        <div className="flex flex-col flex-grow mt-6">
                                                            <p className="text-sm text-slate-200 mb-2">
                                                                <span className="font-semibold">{record.fields.Type}</span> - {record.fields.Venue}
                                                            </p>
                                                            <p className="text-sm text-slate-200 mb-2">
                                                                <span className="font-semibold">Mode:</span> {record.fields.Mode}
                                                            </p>
                                                            <p className="text-sm text-slate-200 mb-4">
                                                                <span className="font-semibold">Date:</span> {record.fields.Date}
                                                            </p>
                                                            <p className="text-sm text-white mb-4">
                                                                {record.fields.Description}
                                                            </p>
                                                        </div>
                                                        <div className="mt-4 border-t pt-4">
                                                            <p className="text-sm font-semibold mb-1 text-white">Coordinators:</p>
                                                            <ul className="list-disc ml-4 text-sm text-white" ref={parent}>
                                                                {coordinators.slice(0, 2).map((coordinatorId, index) => {
                                                                    const { name, department, batch } = getMemberDetailsById(coordinatorId);
                                                                    return (
                                                                        <li key={index}>
                                                                            {name} - {department} - {batch}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>

                                                            {coordinators.length > 2 && (
                                                                <div ref={parent}>
                                                                    {expanded.coordinators[record.id] && (
                                                                        <ul className="list-disc ml-4 text-sm text-white ">
                                                                            {coordinators.slice(2).map((coordinatorId, index) => {
                                                                                const { name, department, batch } = getMemberDetailsById(coordinatorId);
                                                                                return (
                                                                                    <li key={index}>
                                                                                        {name} - {department} - {batch}
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleViewToggle('coordinators', record.id)}
                                                                        className="text-blue-500 hover:underline mx-auto mt-2 text-sm text-center whitespace-nowrap w-full"
                                                                    >
                                                                        {expanded.coordinators[record.id] ? "View Less" : "View More"}
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {coordinators.length === 0 && (
                                                                <li className="text-white">No coordinators</li>
                                                            )}
                                                        </div>
                                                        <div className="mt-4 border-t pt-4">
                                                            <p className="text-sm font-semibold mb-1 text-white">Volunteers:</p>
                                                            <ul className="list-disc ml-4 text-sm text-white">
                                                                {volunteers.slice(0, 2).map((volunteerId, index) => {
                                                                    const { name, department, batch } = getMemberDetailsById(volunteerId);
                                                                    return (
                                                                        <li key={index}>
                                                                            {name} - {department} - {batch}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                            {volunteers.length > 2 && (
                                                                <div ref={parent}>
                                                                    {expanded.volunteers[record.id] && (
                                                                        <ul className="list-disc ml-4 text-sm text-white ">
                                                                            {volunteers.slice(2).map((volunteerId, index) => {
                                                                                const { name, department, batch } = getMemberDetailsById(volunteerId);
                                                                                return (
                                                                                    <li key={index}>
                                                                                        {name} - {department} - {batch}
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleViewToggle('volunteers', record.id)}
                                                                        className="text-blue-500 hover:underline mx-auto mt-2 text-sm text-center whitespace-nowrap w-full"
                                                                    >
                                                                        {expanded.volunteers[record.id] ? "View Less" : "View More"}
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {volunteers.length === 0 && (
                                                                <li className="text-white">No volunteers</li>
                                                            )}
                                                        </div>
                                                        <div className="mt-4 border-t pt-4">
                                                            <p className="text-sm font-semibold mb-1 text-white">Attendees:</p>
                                                            <ul className="list-disc ml-4 text-sm text-white" ref={parent}>
                                                                {attendees.slice(0, 2).map((attendeeId, index) => {
                                                                    const { name, department, batch } = getMemberDetailsById(attendeeId);
                                                                    return (
                                                                        <li key={index}>
                                                                            {name} - {department} - {batch}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                            {attendees.length > 2 && (
                                                                <div ref={parent}>

                                                                    {expanded.attendees[record.id] && (
                                                                        <ul className="list-disc ml-4 text-sm text-white ">
                                                                            {attendees.slice(2).map((attendeeId, index) => {
                                                                                const { name, department, batch } = getMemberDetailsById(attendeeId);
                                                                                return (
                                                                                    <li key={index}>
                                                                                        {name} - {department} - {batch}
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleViewToggle('attendees', record.id)}
                                                                        className="text-blue-500 hover:underline mx-auto mt-2 text-sm text-center whitespace-nowrap w-full"
                                                                    >
                                                                         {expanded.attendees[record.id] ? "View Less" : "View More"}
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {attendees.length === 0 && (
                                                                <li className="text-white">No attendees</li>
                                                            )}
                                                        </div>
                                                    </>
                                                </div>
                                                    <SheetFooter className="my-4">
                                                    <SheetClose asChild>
                                                        <Button className="min-w-[120px] bg-gray-700 hover:bg-gray-600">Close</Button>
                                                    </SheetClose>
                                                </SheetFooter>
                                            </SheetContent>
                                        </Sheet>

                                    </div>
                                );
                            })}
                            {filteredList.length === 0 && (
                                <div className="text-center text-gray-300 py-6 col-span-6 bg-gray-800 p-6 rounded-xl ">No results found</div>
                            )}
                        </div>

                    )}
                </div>
            </main>
            <footer className="text-sm py-4 bottom-0 mx-auto w-full text-center  text-white ">
                <p className="m-0">Crafted with ❤️ by the <a href="https:zamil.vercel.app">Convener😌</a> </p>
            </footer>

        </div>
    );
}

export default Home;



