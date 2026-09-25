// Web3Forms access keys are public by design; submissions go straight from the browser
const ACCESS_KEY = "2738e7c3-8bc9-46d4-acac-071c74d03fa6";

export async function submitToWeb3Forms(formData) {
  formData.append("access_key", ACCESS_KEY);
  const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}
