import MainHeader from "@/components/molecules/MainHeader";
import MainWrapper from "@/components/molecules/MainWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldError from "@/components/molecules/FieldError";
import FormLabel from "@/components/molecules/FormLabel";
import FormInput from "@/components/molecules/FormInput";
import { notify } from "@/components/ui/notify";
import { Bell, Lock } from "lucide-react";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schema/changePasswordSchema";
import { changePassword as changePasswordApi } from "@/api/auth.api";
import { LuBuilding2 } from "react-icons/lu";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/auth/useAuth";
import { useEffect } from "react";
import DailyLogFieldsTab from "./DailyLogFieldsTab";
import {
  getGeneralSettings,
  updateGeneralSettings,
} from "@/api/general-setting.api";
import {
  generalSettingsSchema,
  type GeneralSettingsFormValues,
} from "@/schema/generalSettingsSchema";

const SettingMain = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.name?.toLowerCase() === "administrator";

  return (
    <MainWrapper className="flex flex-col gap-6">
      <MainHeader
        title="Settings"
        description="Manage your organization settings and preferences"
      />

      <Tabs defaultValue={isAdmin ? "general" : "security"} className="gap-4">
        <TabsList>
          {isAdmin && <TabsTrigger value="general">General</TabsTrigger>}
          {isAdmin && (
            <TabsTrigger value="notification">Notification</TabsTrigger>
          )}
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {isAdmin && (
          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="notification">
            <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 pb-8 flex flex-col gap-4 ">
              <div className="flex justify-between">
                <div className="flex gap-4 items-center justify-center">
                  <div className="flex rounded-lg bg-yellow/10 size-10 items-center justify-center">
                    <Bell className="text-yellow size-6" />
                  </div>
                  <div>
                    <h2 className="text-base text-text-high-em font-semibold ">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-text-low-em">
                      Choose what alerts you receive
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y">
                <div className="flex justify-between items-center py-4">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-text-high-em">
                      Refill Reminders
                    </h3>
                    <p className="font-light text-sm text-text-low-em">
                      Get notified about upcoming refills
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-between items-center py-4">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-text-high-em">
                      Patient Updates
                    </h3>
                    <p className="font-light text-sm text-text-low-em">
                      Receive patient status changes
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-between items-center py-4">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-text-high-em">
                      System Alerts
                    </h3>
                    <p className="font-light text-sm text-text-low-em">
                      Important system notifications
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-between items-center py-4">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-text-high-em">
                      Email Notifications
                    </h3>
                    <p className="font-light text-sm text-text-low-em">
                      Send alerts via email
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>
        )}

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </MainWrapper>
  );
};

const GeneralTab = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getGeneralSettings();
        reset(res.data);
      } catch (error) {
        console.error("Failed to fetch general settings", error);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: GeneralSettingsFormValues) => {
    try {
      await updateGeneralSettings(data);
      notify.success(
        "Settings Updated",
        "Organization details have been saved successfully.",
      );
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.data?.message || "Failed to update settings.";
      notify.error("Update Failed", message);
    }
  };

  return (
    <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 pb-8 flex flex-col gap-4 ">
      <div className="flex justify-between mb-4">
        <div className="flex gap-4 items-center justify-center">
          <div className="flex rounded-lg bg-primary/10 size-10 items-center justify-center">
            <LuBuilding2 className="text-text-primary size-6" />
          </div>
          <div>
            <h2 className="text-base text-text-high-em font-semibold ">
              Organization Details
            </h2>
            <p className="text-sm text-text-low-em">
              Update your organization information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
        <div className=" col-span-12">
          <FormLabel>Organization Name</FormLabel>
          <FormInput
            placeholder="E.g ABC Name"
            {...register("organizationName")}
          />
          <FieldError error={errors.organizationName?.message} />
        </div>

        <div className=" md:col-span-6 col-span-12">
          <FormLabel>Phone Number</FormLabel>
          <FormInput placeholder="E.g 123" {...register("phone")} />
          <FieldError error={errors.phone?.message} />
        </div>
        <div className="md:col-span-6 col-span-12">
          <FormLabel>Email</FormLabel>
          <FormInput placeholder="E.g example@exp.com" {...register("email")} />
          <FieldError error={errors.email?.message} />
        </div>
        <div className="col-span-12">
          <FormLabel>Address</FormLabel>
          <FormInput placeholder="E.g ABC Address" {...register("address")} />
          <FieldError error={errors.address?.message} />
        </div>

        <div className="col-span-12 flex pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const SecurityTab = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePasswordApi({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      notify.success(
        "Password Updated",
        "Your password has been changed successfully.",
      );
      reset();
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        "Failed to change password. Please check your current password.";
      notify.error("Change Password Failed", message);
    }
  };

  return (
    <div className="bg-surface-0 rounded-xl drop-shadow-sm p-6 pb-8 flex flex-col gap-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-4 items-center justify-center">
          <div className="flex rounded-lg bg-primary/10 size-10 items-center justify-center">
            <Lock className="text-text-primary size-6" />
          </div>
          <div>
            <h2 className="text-base text-text-high-em font-semibold">
              Password & Security
            </h2>
            <p className="text-sm text-text-low-em">
              Update your account security settings
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-4 max-w-2xl"
      >
        <div className="col-span-12">
          <FormLabel>Current Password</FormLabel>
          <FormInput
            type="password"
            placeholder="Enter current password"
            {...register("currentPassword")}
          />
          <FieldError error={errors.currentPassword?.message} />
        </div>

        <div className="md:col-span-6 col-span-12">
          <FormLabel>New Password</FormLabel>
          <FormInput
            type="password"
            placeholder="Enter new password"
            {...register("newPassword")}
          />
          <FieldError error={errors.newPassword?.message} />
        </div>

        <div className="md:col-span-6 col-span-12">
          <FormLabel>Confirm New Password</FormLabel>
          <FormInput
            type="password"
            placeholder="Confirm new password"
            {...register("confirmNewPassword")}
          />
          <FieldError error={errors.confirmNewPassword?.message} />
        </div>

        <div className="col-span-12 flex pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingMain;
