"use client";

import React, { useState, ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Notes: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const supabase = createClient();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = async () => {
    setIsLoading(true);

    if (!selectedFile) {
      toast.warning("Please select a file to upload");
      setIsLoading(false);
      return;
    }

    const fileName = `${Date.now()}-${selectedFile.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }
      setIsLoading(false);
      setSelectedFile(null);
      setFilePreview(null);
      toast.success("File uploaded successfully!");
    } catch (error) {
      setIsLoading(false);
      toast.error("File upload failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto py-20 px-5">
        <div className="text-3xl py-24">Upload Notes</div>
        <div>
          {filePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <img
                src={filePreview}
                alt="Preview not available"
                className="w-full h-[14.8rem] rounded-lg object-cover"
              />
              <input
                className="hidden"
                type="file"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
              </div>
              <input
                className="hidden"
                type="file"
                onChange={handleFileChange}
              />
            </label>
          )}
          <Button
            disabled={isLoading}
            onClick={handleFileUpload}
            className="mt-5 w-full"
          >
            {isLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            {isLoading ? "Uploading" : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
