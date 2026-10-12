const campaignForm = document.getElementById("campaignForm");

campaignForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token")
  sessionStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to create a campaign");
    window.location.href = "./login.html";
    return;
  }

  const title = campaignForm.querySelector('[name="title"]').value.trim();
  const description = campaignForm.querySelector('[name="description"]').value.trim();
  const targetAmount = Number(campaignForm.querySelector('[name="targetAmount"]').value);
  const deadline = campaignForm.querySelector('[name="deadline"]').value;
  const category = campaignForm.querySelector('[name="category"]').value;
  const image = campaignForm.querySelector('[name="image"]').value.trim();

  if (!title || !description || !targetAmount || !deadline || !category) {
    return alert("All fields are required");
  }

  try {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        title, 
        description, 
        targetAmount, 
        deadline, 
        category, 
        image 
      }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed to create campaign");

    alert("Campaign created successfully 🚀");
    window.location.href = "./dashboard.html";

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
});

async function authFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(localStorage.getItem("token") && {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
      }
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error(data.message || "Request failed");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    return null;
  }
}


async function loadCampaignCategories() {
  console.log("Loading campaign categories...");
  
  const settings = await authFetch("/settings");
  if (!settings) return;

  const select = document.getElementById("campaignCategory");
  if (!select) return;

  select.innerHTML = `
    <option value="">Select a category</option>
    ${settings.campaignCategories.map(cat =>
      `<option value="${cat}">${cat}</option>`
    ).join("")}
  `;
}
loadCampaignCategories();