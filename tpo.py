from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up the WebDriver (ensure you have the appropriate driver installed)

def getimg(img1,img2):
    options = Options()
    #options.add_argument("--headless") 
    #options.add_argument("--window-size=1920x1080")  # Run in headless mode (no GUI)
    driver = webdriver.Chrome(options=options)

    # Open the website
    driver.get("https://kwai-kolors-kolors-virtual-try-on.hf.space")

    # Wait for the page to load
    wait = WebDriverWait(driver, 50)

    print(img1,img2)



    # Step 1: Upload Person Image
    person_image_field = wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/gradio-app/div/div/div[1]/div/div/div[3]/div[1]/div[1]/div[2]/div/button/input")))
    person_image_field.send_keys(img1)
    print("got one")
    # Step 2: Upload Garment Image
    garment_image_field = wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/gradio-app/div/div/div[1]/div/div/div[3]/div[2]/div[1]/div[2]/div/button/input")))
    garment_image_field.send_keys(img2)
    print("got two")
    # Step 3: Click the "Run" Button

    time.sleep(7)
    run_button = wait.until(EC.element_to_be_clickable((By.XPATH, "/html/body/gradio-app/div/div/div[1]/div/div/div[3]/div[3]/button")))
    run_button.click()
    print("btn clicked")
    # Step 4: Wait for Result


    sc = 0
    while True:
        textarea = driver.find_element(By.XPATH, "/html/body/gradio-app/div/div/div[1]/div/div/div[3]/div[3]/div[3]/div/div[2]/label/textarea")
        msg = textarea.get_attribute("value").strip()
        print(msg)
        if msg  == "Success":
            False
            break
        if textarea.get_attribute("value").startswith("Too many user"):
            run_button.click()
            print("tried again")

        if textarea.get_attribute("value").startswith("Empty image"):
            run_button.click()
            print("tried again")
        sc += 1
        time.sleep(1)
        print(sc)



        
    result_image = wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/gradio-app/div/div/div[1]/div/div/div[3]/div[3]/div[1]/div[2]/button/div/img")))
    print("got img")
    # Step 5: (Optional) Download Result
    result_src = result_image.get_attribute("src")
    print(f"Result Image URL: {result_src}")
    driver.quit()

    import requests
    import base64

    response = requests.get(result_src)
    if response.ok:
        encoded_image = base64.b64encode(response.content).decode("utf-8")
        return encoded_image
    else:
        raise Exception("Failed to retrieve image")
    # Save the result if downloadable
    

    # Close the browser
    
