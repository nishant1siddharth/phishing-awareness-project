# Phishing Awareness Project Report

## 1. Introduction
The purpose of this project is to simulate a realistic phishing attack in a safe, controlled environment to assess user susceptibility and provide immediate educational feedback. Phishing remains one of the primary vectors for initial access in cyberattacks. By demonstrating the mechanics of a credential harvesting campaign, this project aims to raise security awareness and train participants to identify common warning signs—such as unexpected urgency and suspicious sender domains—ultimately strengthening the organization's overall security posture.

## 2. Methodology
The simulation was designed as a self-contained web application to ensure zero risk of actual data exposure. The environment consists of three main components designed to mimic a real-world attack chain:

1. **Simulated Inbox & Payload:** A mock email interface was created to present the user with a fabricated "Action Required: Account Security Verification" email. This email utilized common social engineering tactics, including an artificial sense of urgency, generic greetings, and a spoofed sender address.
2. **Credential Harvesting Portal (Mock):** A realistic-looking login page ("Northstar Account Portal") was developed to capture user interactions. Crucially, this page was designed for simulation purposes only; it intercepts form submissions to record the *attempt* but intentionally discards any entered password data, ensuring no actual credentials are ever transmitted or stored securely.
3. **Analytics Dashboard:** A backend server and local database were implemented to track user interactions anonymously. Metrics collected include emails viewed, links clicked, login attempts made, and successful reports of the phishing attempt.

### Simulated Inbox & Email
![Simulated Inbox](assets/images/1_inbox.png)
![Phishing Email](assets/images/2_email.png)

### Fake Login Page
![Fake Login Page](assets/images/4_login_page.png)

## 3. Results
[Discuss the click stats and user reactions.]

### Simulation Statistics Dashboard
![Click Stats Dashboard](assets/images/3_stats_dashboard.png)

## 4. Lessons Learned
[Detail the key takeaways regarding user behavior.]

### Awareness Guide / Educational Output
![Awareness Guide](assets/images/5_awareness_guide.png)

## 5. Preventive Measures
[Provide mitigation strategies and recommendations.]
