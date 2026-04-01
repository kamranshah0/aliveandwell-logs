import FormCard from "@/components/molecules/FormCard";
import FormCardBody from "@/components/molecules/FormCardBody";
import FormCardHeader from "@/components/molecules/FormCardHeader";
import FormInput from "@/components/molecules/FormInput";
import FormLabel from "@/components/molecules/FormLabel";
import FormLabelLg from "@/components/molecules/FormLabelLg";
import FormSelect from "@/components/molecules/FormSelect";
import MainWrapper from "@/components/molecules/MainWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SquarePen, UploadIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [editSection, setEditSection] = useState<
    null | "personal" | "location" | "role"
  >(null);

  const handleDiscard = () => {
    setEditSection(null);
  };

  const handleSave = () => {
    console.log("Save Changes for:", editSection);
    setEditSection(null);
  };

  return (
    <MainWrapper className="grid grid-cols-12 gap-6 pb-16 relative">
      <div className="col-span-12">
        <div className="inline-block">
          <Link
            to={"/users"}
            className=" font-semibold text-lg text-text-high-em flex gap-1 items-center  "
          >
            <ArrowLeft className="size-5" /> My Profile
          </Link>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="grid grid-col-12 ">
          <div className="col-span-12 grid grid-cols-1 gap-6 pb-4">
            {/* Profile Card */}
            <FormCard>
              <FormCardHeader
                className="border-none p-4 "
                htmlTitle={
                  <div className="flex items-center gap-3  ">
                    <div className="size-10 rounded-full border-1 border-dashed border-outline-med-em flex items-center justify-center overflow-hidden bg-surface-1 ">
                      <img
                        src="/images/profile.png"
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-high-em">
                        John Doe
                      </h3>
                      <p className="text-xs font-medium text-text-low-em">
                        Manager
                      </p>
                    </div>
                  </div>
                }
                htmlIcon={
                  <Badge
                    variant="success"
                    className="px-2 py-1 text-xxs text-success-700 rounded-full"
                  >
                    <span className="size-1.5 rounded-full bg-success-600" />
                    Active
                  </Badge>
                }
              />
            </FormCard>

            {/* Personal Information */}
            <FormCard>
              <FormCardHeader
                className="border-none p-4 pb-0"
                htmlTitle={<FormLabelLg>Personal Information</FormLabelLg>}
                htmlIcon={
                  <Button
                    disabled={editSection === "personal"}
                    onClick={() => setEditSection("personal")}
                    className="bg-surface-1 hover:bg-surface-2 flex items-center gap-1.5 pl-3 pr-4 py-2  text-text-med-em  "
                  >
                    <SquarePen className="size-4" />
                    <p className="text-xs font-medium">Edit</p>
                  </Button>
                }
              />

              <FormCardBody className="p-4">
                {/* Profile Upload with Preview */}
                <div className="col-span-12 flex items-center gap-6">
                  <div className="size-16 rounded-full border-1 border-dashed border-outline-med-em flex items-center justify-center overflow-hidden bg-surface-1 ">
                    <img
                      src="/images/profile.png"
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          disabled={editSection !== "personal"}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="profileUpload"
                        />
                        <label
                          htmlFor="profileUpload"
                          className={`px-4 py-2 font-medium text-text-high-em rounded-lg cursor-pointer border-outline-med-em border flex items-center justify-center gap-1 text-sm transition-all ${
                            editSection !== "personal"
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-surface-1"
                          }`}
                        >
                          <UploadIcon className="size-4" />
                          Upload File
                        </label>
                      </div>
                      <span className="text-xs font-medium text-text-low-em">
                        No file chosen
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inputs */}
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>First Name</FormLabel>
                  <FormInput
                    disabled={editSection !== "personal"}
                    placeholder="E.g ABC Name"
                  />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Last Name</FormLabel>
                  <FormInput
                    disabled={editSection !== "personal"}
                    placeholder="E.g ABC Name"
                  />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    disabled={editSection !== "personal"}
                    placeholder="E.g example@exp.com"
                  />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Cell No.</FormLabel>
                  <FormInput
                    disabled={editSection !== "personal"}
                    placeholder="E.g 123"
                  />
                </div>
              </FormCardBody>
            </FormCard>

            {/* Location Information */}
            <FormCard>
              <FormCardHeader
                className="border-none p-4 pb-0"
                htmlTitle={<FormLabelLg>Location Information</FormLabelLg>}
                htmlIcon={
                  <Button
                    disabled={editSection === "location"}
                    onClick={() => setEditSection("location")}
                    className="bg-surface-1 hover:bg-surface-2 flex items-center gap-1.5 pl-3 pr-4 py-2  text-text-med-em  "
                  >
                    <SquarePen className="size-4" />
                    <p className="text-xs font-medium">Edit</p>
                  </Button>
                }
              />

              <FormCardBody className="p-4">
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Country</FormLabel>
                  <FormSelect
                    disabled={editSection !== "location"}
                    placeholder="Select a Country"
                    options={[
                      { label: "United State", value: "United State" },
                      { label: "Pakistan", value: "Pakistan" },
                      { label: "India", value: "India" },
                    ]}
                  />
                </div>
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>City</FormLabel>
                  <FormSelect
                    disabled={editSection !== "location"}
                    placeholder="Select a City"
                    options={[
                      { label: "New York", value: "New York" },
                      { label: "Alaska", value: "Alaska" },
                      { label: "Karachi", value: "Karachi" },
                      { label: "Delhi", value: "Delhi" },
                    ]}
                  />
                </div>
              </FormCardBody>
            </FormCard>

            {/* Role Information */}
            <FormCard>
              <FormCardHeader
                className="border-none p-4 pb-0"
                htmlTitle={<FormLabelLg>Assigned Role</FormLabelLg>}
                htmlIcon={
                  <Button
                    disabled={editSection === "role"}
                    onClick={() => setEditSection("role")}
                    className="bg-surface-1 hover:bg-surface-2 flex items-center gap-1.5 pl-3 pr-4 py-2  text-text-med-em  "
                  >
                    <SquarePen className="size-4" />
                    <p className="text-xs font-medium">Edit</p>
                  </Button>
                }
              />

              <FormCardBody className="p-4">
                <div className="md:col-span-6 col-span-12">
                  <FormLabel>Role</FormLabel>
                  <FormSelect
                    disabled={editSection !== "role"}
                    placeholder="Select a role"
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Manager", value: "manager" },
                      { label: "User", value: "user" },
                    ]}
                  />
                </div>
              </FormCardBody>
            </FormCard>
          </div>
        </div>
      </div>

      {editSection && (
        <div className="fixed bottom-0  w-[calc(100%-200px)] bg-surface-0 border-t border-outline-low-em px-6 py-3 flex justify-end gap-5">
          <Button variant="ghost" onClick={handleDiscard}>
            Discard
          </Button>
          <Button onClick={handleSave} className="bg-primary text-white">
            Save Changes
          </Button>
        </div>
      )}
    </MainWrapper>
  );
};

export default Profile;
