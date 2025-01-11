import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  userId: string;
}

const FileUpload = ({ userId }: FileUploadProps) => {
  const { toast } = useToast();
  const { control, handleSubmit, reset } = useForm();
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsUploading(true);
    try {
      const file = data.file[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({
        title: "File Uploaded",
        description: "Your file has been successfully uploaded.",
      });

      reset();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="file"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <Input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => field.onChange(e.target.files)}
            />
          )}
        />
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </form>
    </div>
  );
};

export default FileUpload;
