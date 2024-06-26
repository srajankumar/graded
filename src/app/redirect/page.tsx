// "use client";

// import { useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { useAuth } from "@clerk/nextjs";
// import Logout from "@/components/Logout";

// const Page = () => {
//   const supabase = createClient();
//   const { userId } = useAuth();

//   useEffect(() => {
//     const sendData = async () => {
//       try {
//         // Check if the userId already exists in the auth table
//         const { data: existingUser, error: fetchError } = await supabase
//           .from("auth")
//           .select("userId")
//           .eq("userId", userId)
//           .maybeSingle();

//         if (fetchError) {
//           console.error("Error fetching data:", fetchError.message);
//           return;
//         }

//         // If userId does not exist, insert the new userId
//         if (!existingUser) {
//           const { data, error } = await supabase.from("auth").insert([
//             {
//               userId: userId,
//             },
//           ]);

//           if (error) {
//             console.error("Error adding data:", error.message);
//           } else {
//             console.log(data, "added success");
//           }
//         } else {
//           console.log("User already exists");
//         }
//       } catch (error) {
//         console.error("Error sending data:", error);
//       }
//     };

//     if (userId) {
//       sendData();
//     }
//   }, [supabase, userId]);

//   return (
//     <div>
//       <Logout />
//       hello world
//     </div>
//   );
// };

// export default Page;

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@clerk/nextjs";
import Logout from "@/components/Logout";

const Page = () => {
  const supabase = createClient();
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const sendData = async () => {
      try {
        // Check if the userId already exists in the auth table
        const { data: existingUser, error: fetchError } = await supabase
          .from("auth")
          .select("userId, admin")
          .eq("userId", userId)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching data:", fetchError.message);
          return;
        }

        // If userId does not exist, insert the new userId with admin set to false
        if (!existingUser) {
          const { data, error } = await supabase.from("auth").insert([
            {
              userId: userId,
              admin: false,
            },
          ]);

          if (error) {
            console.error("Error adding data:", error.message);
          } else {
            console.log(data, "added success");
            router.push("/student/dashboard");
          }
        } else {
          // Redirect based on the admin status
          if (existingUser.admin) {
            router.push("/admin/dashboard");
          } else {
            router.push("/student/dashboard");
          }
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };

    if (userId) {
      sendData();
    }
  }, [supabase, userId, router]);

  return (
    <div>
      <Logout />
      redirecting..
    </div>
  );
};

export default Page;
