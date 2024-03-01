import axios from "axios";

const signUp = async (formData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/signup`,
      formData
    );

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("Failed to signup", error);
  }
};

const signIn = async (formData) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/signin`,
      formData
    );

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("Failed to sigin:", error);
  }
};

const googleAuth = async (authData) => {
  try {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/google`, {
      body: JSON.stringify({
        name: authData.user.displayName,
        email: authData.user.email,
        photo: authData.user.photoURL,
      }),
    });
  } catch (error) {
    throw new Error("Failed to signin google auth:", error);
  }
};

export default { signUp, signIn, googleAuth };
