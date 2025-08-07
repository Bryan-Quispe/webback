const ACCOUNT = 'https://webback-x353.onrender.com/legalsystem/account/';
const PROFILE = 'https://webback-x353.onrender.com/legalsystem/profile/';

const userId=localStorage.getItem("userId") ?? 20;

export const getAccountData = async () =>{
        const uri=ACCOUNT+userId+'/public';
        const response = await fetch(uri,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch Account data");
            }
            else{
                const result=await response.json();
                return result;
            }
    }

export const getProfileData = async () =>{
        const uri=PROFILE+1;
        const response = await fetch(uri,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch profile data");
            }
            else{
                const result=await response.json();
                return result;
            }
    }