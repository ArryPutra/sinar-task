// lib/cron.ts

import { updateEmployeeTaskStatus } from "@/features/employee-task/services/update-employee-task-status";
import cron from "node-cron";

let started = false;

export function startCron() {
  if (started) return;
  started = true;

  cron.schedule("* * * * *", async () => {
    try {
      await updateEmployeeTaskStatus();
    } catch (err) {
      console.error("Cron Error:", err);
    }
  });

  console.log("Cron berjalan setiap menit");
}