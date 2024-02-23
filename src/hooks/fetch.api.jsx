const url = "http://localhost:3000/auth";

export async function signUp(formData) {
  try {
    const res = await fetch(`${url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("Failed to signin", error);
  }
}

export async function signIn(formData) {
  try {
    const res = await fetch(`${url}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("Failed to signup", error);
  }
}
