import ShipmentTabs from "@/components/shared/ShipmentTabs";
import { useState } from "react";
import Users from "./Suppliers";
import { motion, AnimatePresence } from "framer-motion";
import Suppliers from "./Suppliers";

const SupplierCustomer = () => {
  const [activeTab, setActiveTab] = useState("Supplier");

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <>
      <div className="bg-surface-0  sticky top-[72px]">
        <ShipmentTabs
          tabs={["Customer", "Supplier"]}
          defaultTab="Supplier"
          onTabChange={(tab) => setActiveTab(tab)}
          className="pt-2 ps-6"
        />
      </div>

       
        <AnimatePresence mode="wait">
          {activeTab === "Customer" && (
            <motion.div
              key="users"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              
            >
              <Users />
            </motion.div>
          )}

          {activeTab === "Supplier" && (
            <motion.div
              key="roles"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              
            >
              <Suppliers />
            </motion.div>
          )}
        </AnimatePresence>
          
    </>
  );
};

export default SupplierCustomer;
