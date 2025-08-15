import axios from "axios";

export interface Testimonial {
  _id: string;
  name: string;
  message: string;
  rating: number;
  category: string;
  createdAt: string;
}

export const getApprovedTestimonials = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/testimonials/approved"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};
