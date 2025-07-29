import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { joinUrl } from "@/lib/utils";

interface CreateCommentParams {
  post_id: string;
  aptos_address: string;
  content: string;
}

interface CreateCommentResponse {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateCommentParams): Promise<CreateCommentResponse> => {
      const { post_id, aptos_address, content } = params;

      if (!post_id) {
        throw new Error("Post ID is required");
      }

      if (!aptos_address) {
        throw new Error("Aptos address is required");
      }

      if (!content || content.trim().length === 0) {
        throw new Error("Comment content is required");
      }

      if (content.length > 255) {
        throw new Error("Comment must be 255 characters or less");
      }

      const response = await axios.post(
        joinUrl(API_URL, `/api/posts/${post_id}/comments`),
        {
          aptos_address,
          content: content.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            'cb-api-key': process.env.NEXT_PUBLIC_API_KEY || 'your-dev-api-key',
          },
        }
      );

      if (response.status !== 201) {
        throw new Error(`Failed to create comment: ${response.statusText}`);
      }

      console.log("response", response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch posts to update comment count
      queryClient.invalidateQueries({ queryKey: ["globalFeed"] });
      queryClient.invalidateQueries({ queryKey: ["followingFeed"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.post_id] });
    },
    retry: (failureCount, error) => {
      // Don't retry on validation errors
      if (
        error.message.includes("Post ID is required") ||
        error.message.includes("Aptos address is required") ||
        error.message.includes("Comment content is required") ||
        error.message.includes("255 characters or less")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
} 