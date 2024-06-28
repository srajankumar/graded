"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import BarLoader from "@/app/loading";
interface FileObject {
  name: string;
  url: string;
}

const Notes: React.FC = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase.storage
          .from("uploads")
          .list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) {
          throw error;
        }

        const filesData = data.map((file) => {
          const { data: publicUrlData } = supabase.storage
            .from("uploads")
            .getPublicUrl(file.name);
          return {
            name: file.name,
            url: publicUrlData.publicUrl,
          };
        });

        setFiles(filesData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] justify-center items-center">
        <BarLoader />
      </div>
    );
  }

  if (error) {
    return <p>Error loading files: {error}</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto py-20 px-5">
        <div className="text-3xl py-24">Download Notes</div>
        <div className="flex flex-col gap-5">
          {files.slice(1).map((file) => (
            <a
              key={file.name}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-secondary border hover:scale-[101%] transition-all duration-200 flex md:flex-row flex-col rounded-xl md:h-40 p-5 gap-5">
                <img
                  src={file.url}
                  alt="Preview not available"
                  className="md:w-40 w-full md:h-auto h-40 object-cover bg-black/10 rounded-lg"
                />
                <p>{file.name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
