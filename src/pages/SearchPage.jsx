import { useEffect, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";

const SearchPage = () => {
    const [dogs, setDogs] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [matchedDog, setMatchedDog] = useState(null);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [zipCode, setZipCode] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            
            .fetch-animation {
                display: inline-block;
                font-weight: bold;
                color: #ff6f61;
                font-size: 3rem;
                animation: bounce 1.5s infinite;
            }
            
            .dog-card {
                background-color: white;
                border-radius: 10px;
                box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1);
                padding: 15px;
                text-align: center;
                transition: transform 0.2s ease-in-out;
            }
            
            .dog-card:hover {
                transform: scale(1.05);
            }
            
            .fav-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .match-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                text-align: center;
                z-index: 1000;
            }
        `;
        document.head.appendChild(styleSheet);
    }, []);
    

    // Fetch breeds on component mount
    useEffect(() => {
        fetchBreeds();
    }, []);

    // Fetch dogs when filters or pagination change
    useEffect(() => {
        fetchDogs();
    }, [selectedBreed, sortOrder, zipCode, currentPage]);

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
    
            .fetch-animation {
                display: inline-block;
                font-weight: bold;
                color: #ff6f61;
                font-size: 3rem;
                animation: bounce 1.5s infinite;
            }
    
            .filter-container {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                justify-content: center;
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
                margin-top: 20px;
            }
    
            select, input {
                padding: 12px;
                border-radius: 5px;
                font-size: 1rem;
                border: 2px solid #ccc;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
    
            select:hover, input:hover {
                border-color: #ff6f61;
            }
    
            .styled-button {
                background-color: #ff6f61;
                color: white;
                padding: 12px;
                border-radius: 5px;
                cursor: pointer;
                border: none;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
    
            .styled-button:hover {
                background-color: #e55d50;
                transform: scale(1.05);
            }
    
            .reset-button {
                background-color: #007bff;
            }
    
            .reset-button:hover {
                background-color: #0056b3;
            }
        `;
        document.head.appendChild(styleSheet);
    }, []);
    

    // Fetch all breeds
    const fetchBreeds = async () => {
        try {
            const response = await axios.get(
                "https://frontend-take-home-service.fetch.com/dogs/breeds",
                { withCredentials: true }
            );
            setBreeds(response.data);
        } catch (error) {
            console.error("Error fetching breeds:", error);
            setError("Failed to load breeds.");
        }
    };

    // Fetch dogs based on filters
    const fetchDogs = async () => {
        setIsLoading(true);
        try {
            let breedQuery = selectedBreed ? `&breeds=${encodeURIComponent(selectedBreed)}` : "";
            let zipQuery = zipCode ? `&zipCodes=${encodeURIComponent(zipCode)}` : "";
            let sortQuery = `&sort=breed:${sortOrder}`;

            const requestURL = `https://frontend-take-home-service.fetch.com/dogs/search?size=10&from=${currentPage * 10}${breedQuery}${zipQuery}${sortQuery}`;

            const response = await axios.get(requestURL, { withCredentials: true });

            if (!response.data.resultIds || response.data.resultIds.length === 0) {
                setDogs([]);
                return;
            }

            const dogIds = response.data.resultIds;
            const dogDetailsResponse = await axios.post(
                "https://frontend-take-home-service.fetch.com/dogs",
                dogIds,
                { withCredentials: true }
            );

            setDogs(dogDetailsResponse.data);
        } catch (error) {
            console.error("Error fetching dogs:", error);
            setError("Failed to load dogs.");
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle favorite dogs
    const toggleFavorite = (dog) => {
        setFavorites((prev) =>
            prev.some((fav) => fav.id === dog.id)
                ? prev.filter((fav) => fav.id !== dog.id)
                : [...prev, dog]
        );
    };

    // Find a match from favorites
    const findMatch = async () => {
        if (favorites.length === 0) {
            alert("Please select at least one favorite dog.");
            return;
        }

        try {
            const favoriteIds = favorites.map((dog) => dog.id);
            const response = await axios.post(
                "https://frontend-take-home-service.fetch.com/dogs/match",
                favoriteIds,
                { withCredentials: true }
            );

            if (!response.data || !response.data.match) {
                console.warn("No match found!");
                return;
            }

            const matchedDogId = response.data.match;
            const matchedDogResponse = await axios.post(
                "https://frontend-take-home-service.fetch.com/dogs",
                [matchedDogId],
                { withCredentials: true }
            );

            if (matchedDogResponse.data.length > 0) {
                setMatchedDog(matchedDogResponse.data[0]);
            } else {
                console.warn("Matched dog details not found!");
            }
        } catch (error) {
            console.error("Error finding match:", error);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post("https://frontend-take-home-service.fetch.com/auth/logout", {}, { withCredentials: true });
            localStorage.removeItem("user");
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div style={{ 
            textAlign: "center", 
            padding: "20px", 
            fontFamily: "Arial, sans-serif", 
            backgroundColor: "#f8f9fa", 
            minHeight: "100vh",
            backgroundImage: "url('https://www.transparenttextures.com/patterns/paw-print.png')" 
        }}>
            {/* Confetti for match celebration */}
            {matchedDog && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            {/* Header */}
            <h1>
                <span className="fetch-animation">Fetch</span>
                🐾 Your Paw-fect Match!
            </h1>


            {/* Logout Button */}
            <button onClick={handleLogout} style={{
                backgroundColor: "red",
                color: "white",
                padding: "10px",
                marginBottom: "20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }}>
                🚪 Logout
            </button>

            {/* Error Message */}
            {error && (
                <div style={{ 
                    backgroundColor: "#ffebee", 
                    color: "#c62828", 
                    padding: "10px", 
                    borderRadius: "5px", 
                    marginBottom: "20px", 
                    textAlign: "center" 
                }}>
                    {error}
                </div>
            )}

            {/* Filters */}
            <div style={{ 
                backgroundColor: "#fff", 
                padding: "20px", 
                borderRadius: "10px", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                marginBottom: "20px" 
            }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                    
                </div>
            </div>

            <div className="filter-container">
    {/* Breed Dropdown */}
    <select 
        onChange={(e) => setSelectedBreed(e.target.value)} 
        value={selectedBreed}
    >
        <option value="">All Breeds</option>
        {breeds.map((breed) => (
            <option key={breed} value={breed}>
                {breed}
            </option>
        ))}
    </select>

    {/* Sort Button */}
    <button 
        className="styled-button" 
        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
    >
        Sort by Breed ({sortOrder === "asc" ? "A → Z" : "Z → A"})
    </button>

    {/* ZIP Code Input */}
    <input 
        type="text" 
        placeholder="Enter ZIP code" 
        value={zipCode} 
        onChange={(e) => setZipCode(e.target.value)}
    />

    {/* Search by Location Button */}
    <button 
        className="styled-button" 
        onClick={fetchDogs}
    >
        🔍 Search by Location
    </button>

    {/* Reset Filters Button */}
    <button 
        className="styled-button reset-button" 
        onClick={() => {
            setSelectedBreed("");
            setZipCode("");
            setSortOrder("asc");
            setCurrentPage(0);
            fetchDogs();
        }}
    >
        🔄 Reset Filters
    </button>
</div>


            {/* Loading State */}
            {isLoading ? (
                <div style={{ textAlign: "center", margin: "20px" }}>
                    <div className="loader">Loading...</div>
                </div>
            ) : (
                /* Dog Cards */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", marginTop: "20px" }}>
                    {dogs.map((dog) => (
                        <div key={dog.id} style={{ 
                            backgroundColor: "white", 
                            borderRadius: "10px", 
                            boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.1)", 
                            padding: "15px", 
                            textAlign: "center",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            cursor: "pointer",
                            ":hover": {
                                transform: "scale(1.05)",
                                boxShadow: "2px 4px 16px rgba(0, 0, 0, 0.2)"
                            }
                        }}>
                            <img src={dog.img} alt={dog.name} width="100%" style={{ borderRadius: "10px", marginBottom: "10px" }} />
                            <h3>{dog.name} ({dog.breed})</h3>
                            <p>Age: {dog.age} | ZIP: {dog.zip_code}</p>
                            <button onClick={() => toggleFavorite(dog)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                                {favorites.some(fav => fav.id === dog.id) ? "❤️" : "🤍"}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                <button 
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} 
                    disabled={currentPage === 0}
                    style={{ padding: "10px", backgroundColor: "#ff6f61", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Previous
                </button>
                <span style={{ padding: "10px" }}>Page {currentPage + 1}</span>
                <button 
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    style={{ padding: "10px", backgroundColor: "#ff6f61", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                >
                    Next
                </button>
            </div>

            {/* Find Match Button */}
            {favorites.length > 0 && (
                <button onClick={findMatch} style={{ 
                    marginTop: "20px", 
                    padding: "10px", 
                    backgroundColor: "#ff6f61", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "5px", 
                    cursor: "pointer" 
                }}>
                    Find My Best Match
                </button>
            )}

            {/* Match Modal */}
            {matchedDog && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                    zIndex: 1000
                }}>
                    <h2>🎉 Your Best Match!</h2>
                    <img src={matchedDog.img} alt={matchedDog.name} width="200px" style={{ borderRadius: "10px" }} />
                    <p>{matchedDog.name} ({matchedDog.breed})</p>
                    <button 
                        onClick={() => setMatchedDog(null)} 
                        style={{ marginTop: "10px", padding: "10px", backgroundColor: "#ff6f61", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;