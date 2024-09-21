// import { useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function ImageUpload ({onUpload}) {
//     const [uploading, setUploading] = useState(false);

//     async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
//         try {
//             setUploading(true);
//             if(!event.target.files || event.target.files.length === 0) {
//                 throw new Error("You must select an image to upload.");
//             }

//             const file = event.target.files[0];
//             const fileExt = file.name.split(".").pop();
//             const fileName = `${Math.random()}.${fileExt}`;
//         }
//     }
// }