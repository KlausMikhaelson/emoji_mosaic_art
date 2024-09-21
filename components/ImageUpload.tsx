import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ImageUpload ({onUpload} : {onUpload: (url: string) => void}) {
    const [uploading, setUploading] = useState(false);

    async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if(!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const {error: uploadError} = await supabase.storage.from("images").upload(filePath, file);
            if(uploadError) {
                throw uploadError;
            }

            onUpload(filePath);
        } catch (error) {
            console.error("Error uploading image", error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
            {uploading && <p>Uploading...</p>}
        </div>
    )
}