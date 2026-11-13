import { z } from "zod";

export const birthDownloadSchema = z.object({
  dateOfBirth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use the format DD/MM/YYYY")
    .refine(
      (value) => {
        const [day, month, year] = value.split("/").map(Number);
        const date = new Date(year, month - 1, day);

        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      },
      { message: "Enter a real calendar date" },
    )
    .refine(
      (value) => {
        const [day, month, year] = value.split("/").map(Number);
        return new Date(year, month - 1, day) <= new Date();
      },
      { message: "Date of birth cannot be in the future" },
    ),
  motherFirstName: z.string().min(3, "Mother's name is required"),
  birthCertificateNo: z.string().min(1, "Certificate number is required"),
});
