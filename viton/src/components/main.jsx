import React, { useState,useEffect } from "react";
import './main.css';
import Loadani from '../assests/loading.gif';
import Backani from '../assests/back.gif';
import { useNavigate } from "react-router-dom";

const Main = () => {
    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [generatedImg, setGeneratedImg] = useState(null);
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");

        if (authStatus === "true") {
            setIsAuthenticated(true);
        } else {
            navigate("/"); // Redirect if not authenticated
        }
    }, [navigate]);

    const previewImage = (event, imgId) => {
        const file = event.target.files[0];

        if (imgId === "previewPerson") {
            setImg1(file);
        } else {
            setImg2(file);
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.getElementById(imgId);
                img.src = e.target.result;
                img.style.display = 'block';
                event.target.previousElementSibling.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };

    const sendImagesToAPI = async () => {
        setLoading(true);
        setGeneratedImg(null);

        if (!img1 || !img2) {
            alert("Please upload both images.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("image1", img1);
        formData.append("image2", img2);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 100000);

            const response = await fetch("http://127.0.0.1:8000/generate", {
                method: "POST",
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.generated_image) {
                // If the returned string is not a data URL, prepend the prefix.
                const base64Image = data.generated_image.startsWith("data:")
                    ? data.generated_image
                    : `data:image/jpeg;base64,${data.generated_image}`;
                setGeneratedImg(base64Image);
            } else {
                throw new Error("No image received in response.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main" style={{ backgroundImage: `url(${Backani})` }}>
            <div className="container text-center">
                <h2 className="mb-4">Virtual Try On</h2>
                <div className="row justify-content-around" >
                    {/* Upload Person */}
                    <div className="col-md-4 out-box">
                        <h5>Person Image</h5>
                        <div className="box" id="box1" onClick={() => document.getElementById('uploadPerson').click()}>
                            <span>Click to Upload</span>
                            <input type="file" id="uploadPerson" accept="image/*"
                                onChange={(e) => previewImage(e, 'previewPerson')} />
                            <img id="previewPerson" alt="person preview" />
                        </div>
                    </div>

                    {/* Upload Clothing */}
                    <div className="col-md-4 out-box">
                        <h5 className="">Garment Image</h5>
                        <div className="box rounded-lg" id="box2" onClick={() => document.getElementById('uploadClothing').click()}>
                            <span>Click to Upload</span>
                            <input type="file" id="uploadClothing" accept="image/*"
                                onChange={(e) => previewImage(e, 'previewClothing')} />
                            <img id="previewClothing" alt="garment image" />
                        </div>
                    </div>

                    {/* AI Generated Image */}
                    <div className="col-md-4 out-box">
                        <h5>Generated Image</h5>
                        <div className="box" id="box3">
                            {loading && (
                                <div className="loading" id="loadingText" style={{
                                    backgroundImage: `url(${Loadani})`,

                                }}></div>
                            )}
                            {generatedImg && (
                                <img
                                    id="generatedImage"
                                    src={generatedImg}
                                    alt="AI Generated"

                                />
                            )}
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary mt-3 w-25 rounded-pill" id="generateBtn" onClick={sendImagesToAPI}>
                    <i class="fa fa-magic" aria-hidden="true"></i> Generate
                </button>
            </div>
        </div>
    );
};

export default Main;
