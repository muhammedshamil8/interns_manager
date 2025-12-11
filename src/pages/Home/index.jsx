

import { useState, useEffect, useRef } from "react";
import { fetchRecords } from "@/utils/airtableService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAutoAnimate } from '@formkit/auto-animate/react';
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
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Calendar,
    MapPin,
    Users,
    Monitor,
    ExternalLink,
    Heart
} from "lucide-react";

const SkeletonLoader = ({ count }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700"
                >
                    <Skeleton className="h-48 w-full bg-gray-700" />
                    <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                        <Skeleton className="h-4 w-1/2 mb-4 bg-gray-700" />
                        <Skeleton className="h-10 w-full bg-gray-700" />
                    </div>
                </div>
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
    const [parent] = useAutoAnimate();

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

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col">
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Connect Events
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <NavLink
                            to="/myscore"
                            className="flex items-center gap-2 px-4 py-2 mr-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                        >
                            <Monitor size={18} />
                            My Score
                        </NavLink>
                        <NavLink
                            to="/scoreboard"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                        >
                            <Users size={18} />
                            View Scoreboard
                            <ExternalLink size={16} />
                        </NavLink>
                        </div>

                    </header>

                    <div className="relative mb-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <Input
                                type="text"
                                placeholder="Search events by name..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div ref={parent}>
                        {loading ? (
                            <SkeletonLoader count={8} />
                        ) : (
                            <>
                                {filteredList.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" ref={parent}>
                                        {filteredList.map((record) => {
                                            const coordinators = record.fields.Coordinators || [];
                                            const volunteers = record.fields.Volunteers || [];
                                            const attendees = record.fields.Attendees || [];

                                            return (
                                                <div
                                                    key={record.id}
                                                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500/30 hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
                                                >
                                                    {record.fields.Image && (
                                                        <div className="relative h-48 overflow-hidden">
                                                            <img
                                                                src={record.fields.Image[0].url}
                                                                alt={record.fields.Name}
                                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                            />
                                                            <div className="absolute top-3 right-3">
                                                                <Badge className={`${record.fields.Mode === 'Online' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                                                                    {record.fields.Mode}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-4 flex flex-col flex-grow">
                                                        <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                                                            {record.fields.Name}
                                                        </h2>

                                                        <div className="flex items-center text-sm text-gray-300 mb-2">
                                                            <MapPin size={16} className="mr-1" />
                                                            <span>{record.fields.Venue}</span>
                                                        </div>

                                                        <div className="flex items-center text-sm text-gray-300 mb-3">
                                                            <Calendar size={16} className="mr-1" />
                                                            <span>{formatDate(record.fields.Date)}</span>
                                                        </div>

                                                        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
                                                            {record.fields.Description}
                                                        </p>

                                                        <div className="mt-auto">
                                                            <Sheet>
                                                                <SheetTrigger asChild>
                                                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-300">
                                                                        View Details
                                                                    </Button>
                                                                </SheetTrigger>
                                                                <SheetContent className="bg-gray-900 border-l border-gray-800 text-white overflow-y-auto w-full sm:max-w-lg">
                                                                    <div className="h-full flex flex-col">
                                                                        <SheetHeader className="mb-6">
                                                                            <SheetTitle className="text-2xl font-bold text-white">
                                                                                {record.fields.Name}
                                                                            </SheetTitle>
                                                                            <SheetDescription className="text-gray-400">
                                                                                Event details and participant information
                                                                            </SheetDescription>
                                                                        </SheetHeader>

                                                                        <div className="flex-1 overflow-y-auto pr-2">
                                                                            {record.fields.Image && (
                                                                                <img
                                                                                    src={record.fields.Image[0].url}
                                                                                    alt={record.fields.Name}
                                                                                    className="w-full h-48 object-cover rounded-lg mb-6"
                                                                                />
                                                                            )}

                                                                            <div className="space-y-4 mb-6">
                                                                                <div className="flex items-center text-sm">
                                                                                    <Badge variant="outline" className="mr-2 bg-gray-800 text-blue-400">
                                                                                        {record.fields.Type}
                                                                                    </Badge>
                                                                                    <div className="flex items-center text-gray-300">
                                                                                        <MapPin size={16} className="mr-1" />
                                                                                        <span>{record.fields.Venue}</span>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex items-center text-sm text-gray-300">
                                                                                    <Monitor size={16} className="mr-1" />
                                                                                    <span>Mode: {record.fields.Mode}</span>
                                                                                </div>

                                                                                <div className="flex items-center text-sm text-gray-300">
                                                                                    <Calendar size={16} className="mr-1" />
                                                                                    <span>Date: {formatDate(record.fields.Date)}</span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="mb-6">
                                                                                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                                                                                <p className="text-sm text-gray-300">
                                                                                    {record.fields.Description}
                                                                                </p>
                                                                            </div>

                                                                            <div className="space-y-6">
                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                                                        <Users size={18} className="mr-2" />
                                                                                        Coordinators
                                                                                        <Badge className="ml-2 bg-blue-600">{coordinators.length}</Badge>
                                                                                    </h3>
                                                                                    <ul className="space-y-2">
                                                                                        {coordinators.length > 0 ? (
                                                                                            <>
                                                                                                {coordinators.slice(0, expanded.coordinators[record.id] ? coordinators.length : 2).map((coordinatorId, index) => {
                                                                                                    const { name, department, batch } = getMemberDetailsById(coordinatorId);
                                                                                                    return (
                                                                                                        <li key={index} className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
                                                                                                            <span className="font-medium text-white">{name}</span> - {department} • {batch}
                                                                                                        </li>
                                                                                                    );
                                                                                                })}
                                                                                                {coordinators.length > 2 && (
                                                                                                    <button
                                                                                                        onClick={() => handleViewToggle('coordinators', record.id)}
                                                                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
                                                                                                    >
                                                                                                        {expanded.coordinators[record.id] ? "Show less" : `Show all ${coordinators.length} coordinators`}
                                                                                                    </button>
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            <li className="text-gray-500 text-sm">No coordinators listed</li>
                                                                                        )}
                                                                                    </ul>
                                                                                </div>

                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                                                        <Users size={18} className="mr-2" />
                                                                                        Volunteers
                                                                                        <Badge className="ml-2 bg-purple-600">{volunteers.length}</Badge>
                                                                                    </h3>
                                                                                    <ul className="space-y-2">
                                                                                        {volunteers.length > 0 ? (
                                                                                            <>
                                                                                                {volunteers.slice(0, expanded.volunteers[record.id] ? volunteers.length : 2).map((volunteerId, index) => {
                                                                                                    const { name, department, batch } = getMemberDetailsById(volunteerId);
                                                                                                    return (
                                                                                                        <li key={index} className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
                                                                                                            <span className="font-medium text-white">{name}</span> - {department} • {batch}
                                                                                                        </li>
                                                                                                    );
                                                                                                })}
                                                                                                {volunteers.length > 2 && (
                                                                                                    <button
                                                                                                        onClick={() => handleViewToggle('volunteers', record.id)}
                                                                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
                                                                                                    >
                                                                                                        {expanded.volunteers[record.id] ? "Show less" : `Show all ${volunteers.length} volunteers`}
                                                                                                    </button>
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            <li className="text-gray-500 text-sm">No volunteers listed</li>
                                                                                        )}
                                                                                    </ul>
                                                                                </div>

                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                                                        <Users size={18} className="mr-2" />
                                                                                        Attendees
                                                                                        <Badge className="ml-2 bg-green-600">{attendees.length}</Badge>
                                                                                    </h3>
                                                                                    <ul className="space-y-2">
                                                                                        {attendees.length > 0 ? (
                                                                                            <>
                                                                                                {attendees.slice(0, expanded.attendees[record.id] ? attendees.length : 2).map((attendeeId, index) => {
                                                                                                    const { name, department, batch } = getMemberDetailsById(attendeeId);
                                                                                                    return (
                                                                                                        <li key={index} className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
                                                                                                            <span className="font-medium text-white">{name}</span> - {department} • {batch}
                                                                                                        </li>
                                                                                                    );
                                                                                                })}
                                                                                                {attendees.length > 2 && (
                                                                                                    <button
                                                                                                        onClick={() => handleViewToggle('attendees', record.id)}
                                                                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
                                                                                                    >
                                                                                                        {expanded.attendees[record.id] ? "Show less" : `Show all ${attendees.length} attendees`}
                                                                                                    </button>
                                                                                                )}
                                                                                            </>
                                                                                        ) : (
                                                                                            <li className="text-gray-500 text-sm">No attendees listed</li>
                                                                                        )}
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <SheetFooter className="mt-6 pt-4 border-t border-gray-800">
                                                                            <SheetClose asChild>
                                                                                <Button className="bg-gray-800 hover:bg-gray-700 text-white">Close</Button>
                                                                            </SheetClose>
                                                                        </SheetFooter>
                                                                    </div>
                                                                </SheetContent>
                                                            </Sheet>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                                        <Search size={48} className="mx-auto text-gray-500 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-300 mb-2">No events found</h3>
                                        <p className="text-gray-500">Try adjusting your search query</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <footer className="py-3 text-center text-gray-500 text-sm border-t border-gray-800/50 bg-gray-900/50">
                <p className="flex items-center justify-center gap-1">
                    Crafted with <Heart size={16} className="text-red-500 fill-current" /> by
                    <a
                        href="https://zamil.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-300 hover:text-blue-400 transition-colors"
                    >
                        Shamil
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default Home;
