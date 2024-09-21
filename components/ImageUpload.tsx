import { useState } from "react";

export default function ImageUpload ({onUpload} : {onUpload: (url: string) => void}) {
    const [uploading, setUploading] = useState(false);

    async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if(!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                onUpload(reader.result as string);
            };

            reader.readAsDataURL(file);
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