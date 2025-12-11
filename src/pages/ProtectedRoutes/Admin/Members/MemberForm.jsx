import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CrudRecords,
  fetchRecords,
  fetchSingleRecord,
} from "@/utils/airtableService";
import { useNavigate, useParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader,
  ArrowLeft,
  UserPlus,
  UserCog,
  Phone,
  Award,
  Building2,
  Calendar,
  BadgeCheck,
  User,
} from "lucide-react";
import departments from "@/const/department";

// Define the schema for member validation
const memberSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  phone_number: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "Phone number must be exactly 10 digits",
  }),
  Year_Joined: z.string().refine((value) => /^\d{4}$/.test(value), {
    message: "Year Joined must be a 4-digit number",
  }),
  Position: z.string().min(1, { message: "Position is required" }),
  Active: z.boolean().optional(),
 Bonus_points: z
  .number()
  .min(0, { message: "Bonus points cannot be negative" })
  .default(0)
  .or(z.string().transform((v) => Number(v) || 0)),
});

function MemberForm() {
  const { id } = useParams();
  const [mode, setMode] = useState("create");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState(departments);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      department: "",
      phone_number: "",
      Year_Joined: "",
      Position: "",
      Active: true,
      Bonus_points: 0,
    },
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchMemberData(id);
    }
  }, [id]);

  async function fetchMemberData(id) {
    try {
      const Records = await fetchSingleRecord("members", id);
      setMode("edit");

      if (Records && Records.fields) {
        form.setValue("name", Records.fields.name || "");
        form.setValue("department", Records.fields.department || "");
        form.setValue("phone_number", Records.fields.phone_number || "");
        form.setValue("Year_Joined", Records.fields.Year_Joined || "");
        form.setValue("Position", Records.fields.Position || "");
        form.setValue("Active", Records.fields.Active ?? true);
        form.setValue("Bonus_points", Records.fields.Bonus_points || 0);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      const bodyData = { fields: data };

      if (mode === "create") {
        await CrudRecords("members", "POST", bodyData);
        toast({
          title: "Member Created",
          description: "Member has been created successfully",
          variant: "success",
        });
        form.reset();
      } else if (mode === "edit") {
        await fetchSingleRecord("members", id, "PATCH", bodyData);
        toast({
          title: "Member Updated",
          description: "Member has been updated successfully",
          variant: "success",
        });
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const positionOptions = [
    { label: "Lead", value: "Lead" },
    { label: "Program Organizer", value: "Program Organizer" },
    { label: "Content Writer", value: "Content writer" },
    { label: "Working member", value: "Working member" },
    { label: "Media", value: "Media" },
    { label: "Marketing", value: "Marketing" },
    { label: "Graphic designer", value: "Graphic designer" },
    { label: "Video editor/photographer", value: "Video editor/photographer" },
    { label: "Community Manager", value: "Community Manager" },
    { label: "Technical Team", value: "Technical Team" },
  ];

  const years = [
    { label: "2021", value: "2021" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {mode === "create" ? "Create New Member" : "Edit Member"}
            </h1>
            <p className="text-gray-400">
              {mode === "create"
                ? "Add a new member to your organization"
                : "Update member information"}
            </p>
          </div>
        </div>

        <Card className="w-full shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              {mode === "create" ? (
                <UserPlus className="w-8 h-8" />
              ) : (
                <UserCog className="w-8 h-8" />
              )}
              <CardTitle className="text-2xl ">
                {mode === "create"
                  ? "New Member Registration"
                  : "Member Details"}
              </CardTitle>
            </div>
          </CardHeader>

          <Form {...form}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-400">
                  Loading member data...
                </span>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                      </h3>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter member's full name"
                                {...field}
                                className="bg-gray-50 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter 10-digit phone number"
                                {...field}
                                className="bg-gray-50 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Organization Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Organization Details
                      </h3>

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Department
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Search department..."
                                  className="mb-2 bg-gray-50 border-gray-300"
                                  onChange={(e) => {
                                    const q = e.target.value.toLowerCase();
                                    setFilteredDepartments(
                                      departments.filter((d) =>
                                        d.label.toLowerCase().includes(q)
                                      )
                                    );
                                  }}
                                />

                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="bg-gray-50 border-gray-300">
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {filteredDepartments.map((department) => (
                                      <SelectItem
                                        key={department.value}
                                        value={department.value}
                                      >
                                        {department.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>

                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="Position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Position
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-50 border-gray-300">
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {positionOptions.map((position) => (
                                  <SelectItem
                                    key={position.value}
                                    value={position.value}
                                  >
                                    {position.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Additional Information */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="Year_Joined"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Year Joined
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-gray-50 border-gray-300">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem
                                    key={year.value}
                                    value={year.value}
                                  >
                                    {year.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="Bonus_points"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Bonus Points
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter bonus points"
                                {...field}
                                className="bg-gray-50 border-gray-300"
                              />
                            </FormControl>
                            <FormDescription className="text-gray-500">
                              Additional points for exceptional contributions
                            </FormDescription>
                            <FormMessage className="text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="border-t pt-6 mt-6">
                    <FormField
                      control={form.control}
                      name="Active"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-blue-600 border-gray-300"
                            />
                          </FormControl>
                          <div className="space-y-0.5">
                            <FormLabel className="text-gray-700 flex items-center gap-2">
                              <BadgeCheck className="w-4 h-4" />
                              Active Member
                            </FormLabel>
                            <FormDescription className="text-gray-500">
                              Uncheck to mark this member as inactive
                            </FormDescription>
                          </div>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 px-6 py-4 rounded-b-lg border-t">
                  <div className="flex gap-3 w-full justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      disabled={submitLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          {mode === "create" ? "Creating..." : "Updating..."}
                        </>
                      ) : (
                        <>
                          {mode === "create"
                            ? "Create Member"
                            : "Update Member"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default MemberForm;
