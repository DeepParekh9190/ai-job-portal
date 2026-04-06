import sys

with open("d:\\ai-job-portal\\PROJECT_REPORT.md", "r", encoding="utf-8") as f:
    text = f.read()

# Expand Chapter 2
ch2_old = """The contemporary recruitment landscape is beset by significant operational inefficiencies that negatively impact both candidates seeking opportunities and organizations seeking talent. The core problem lies in the disconnect between how a candidate's abilities are evaluated and the actual requirements of the job, exacerbated by the sheer volume of digital applications submitted for every open position.

For job seekers, the primary challenge is achieving visibility in an overcrowded market. Standardized application processes rely heavily on traditional resumes, which are fundamentally flawed communication tools. Professional resume writing is a distinct skill separate from the actual technical or professional skills required for the job. A highly competent software engineer or marketing executive might lack the grammatical precision or formatting knowledge to pass an automated Applicant Tracking System (ATS). Consequently, candidates spend disproportionate amounts of time constantly re-writing and tailoring their documents to match specific job descriptions, leading to application fatigue and high drop-off rates. Furthermore, the persistent lack of actionable feedback following a rejection leaves candidates unable to identify their weaknesses and improve subsequent applications.

From the employer's perspective, the ease of digital applications has led to the "resume spam" phenomenon. Human Resources personnel and hiring managers are routinely inundated with hundreds of applications, a vast majority of which fail to meet the basic criteria for the role. Manually reviewing these documents is an incredibly resource-intensive process that is inherently susceptible to human fatigue and unconscious bias. While legacy ATS solutions attempt to alleviate this burden through keyword matching, they are rigidly semantic. For instance, an ATS might reject a candidate who uses the term "Client Relations" when the algorithm is strictly scanning for "Customer Success." This rigidity results in companies missing out on exceptional talent while simultaneously spending excessive capital on recruitment cycles.

The structural divide between the candidate's presentation and the employer's expectations necessitates a sophisticated technical solution. A platform is required that can intelligently decipher the context and equivalent meaning behind different professional terminologies, accurately scoring candidates based on genuine capability rather than keyword density. Furthermore, the solution must automate the laborious tasks of drafting and analyzing documents to restore efficiency. By introducing an AI-driven intermediary, the system can parse unstructured data from resumes, align it with the semantic intent of a job description, and present hiring managers with a pre-ranked, logically evaluated shortlist, thus solving a critical, real-world logistical bottleneck in the modern economy."""

ch2_new = """The contemporary recruitment landscape is beset by significant operational inefficiencies that negatively impact both candidates seeking opportunities and organizations seeking talent. The core problem lies in the disconnect between how a candidate's abilities are evaluated and the actual requirements of the job, exacerbated by the sheer volume of digital applications submitted for every open position. As global talent pools become increasingly accessible via digital platforms, the initial screening processes have failed to adapt proportionally, resulting in a systemic bottleneck. Organizations struggle to process the influx of applications effectively, while highly qualified professionals frequently face arbitrary rejections rooted in technological limitations rather than genuine skill deficiencies.

For job seekers, the primary challenge is achieving visibility in an overcrowded market. Standardized application processes rely heavily on traditional resumes, which remain fundamentally flawed communication tools. Professional resume writing is a distinct, specialized skill that is entirely separate from the actual technical or professional competencies required for most jobs. A highly competent software engineer, a skilled data analyst, or an experienced marketing executive might lack the grammatical precision, formatting knowledge, or keyword awareness required to successfully bypass a mechanized Applicant Tracking System (ATS). Consequently, candidates spend a disproportionate amount of time constantly re-writing and tailoring their documents to match the nuanced vocabulary of specific job descriptions. This tedious repetition leads strictly to application fatigue and high drop-off rates, discouraging top-tier talent from actively participating in the job market. Furthermore, the persistent and widespread lack of actionable feedback following a rejection leaves candidates stranded—unable to identify their structural weaknesses or improve their approach in subsequent applications. They are forced to iterate in the dark, leading to a frustrating and demoralizing employment search experience.

From the employer's perspective, the convenience of digital application portals has inadvertently catalyzed the widespread "resume spam" phenomenon. Human Resources personnel and technical hiring managers are routinely inundated with hundreds, sometimes thousands, of applications for a single opening. A vast majority of these submissions completely fail to meet the basic criteria for the role. Manually reviewing these documents is an incredibly resource-intensive, expensive, and protracted process that is inherently susceptible to human fatigue, inconsistent evaluation criteria, and unconscious bias. While legacy ATS solutions attempt to alleviate this manual administrative burden through elementary keyword matching algorithms, they operate on a rigidly semantic level. For instance, a legacy ATS might instantaneously reject an excellent candidate who utilizes the technical term "Client Relations" simply because the automated algorithm is strictly hard-coded to scan for the term "Customer Success." This programmatic rigidity guarantees that modern companies are continuously missing out on exceptional, diverse talent while simultaneously spending excessive amounts of financial capital on prolonged recruitment cycles.

The deepening structural divide between the candidate's presentation of their skills and the employer's stringent evaluative expectations necessitates a sophisticated, multifaceted technical solution. A robust platform is required that can intelligently and seamlessly decipher the underlying context, practical implications, and equivalent meaning behind various professional terminologies. This platform must possess the capability to accurately score candidates based on their genuine capability and holistic expertise rather than superficial keyword density. Furthermore, the intended solution must aggressively automate the laborious, repetitive tasks of drafting tailored documents and analyzing bulk submissions to restore operational efficiency. By introducing a centralized, AI-driven intermediary, the proposed system can intelligently parse unstructured data from diverse resumes, seamlessly align it with the deeply layered semantic intent of a job description, and instantly present hiring managers with a pre-ranked, logically evaluated candidate shortlist. This strategic integration effectively neutralizes a critical, real-world logistical bottleneck, paving the way for a distinctly modernized, equitable, and highly efficient hiring ecosystem."""

text = text.replace(ch2_old, ch2_new)

# Generate new Chapter 5 Content
ch5_new = """# Chapter 5 – System Design

### 5.1 Data Flow Diagram (DFD)

```mermaid
graph TD
    JS((Job Seeker))
    EMP((Employer))
    ADMIN((Administrator))
    
    subgraph TalentorAI System
        AUTH[Authentication Module]
        PR[Profile Manager]
        JM[Job Management]
        APP[Application Processor]
        AI[AI Matcher & Engine]
    end
    
    DB[(MongoDB Database)]

    JS -->|Credentials| AUTH
    EMP -->|Credentials| AUTH
    ADMIN -->|Credentials| AUTH
    
    AUTH -->|Token| DB
    
    JS -->|Resume/Skills Data| PR
    PR -->|Raw Data| AI
    AI -->|Generated Resume & ATS Score| PR
    PR -->|User Profile| DB
    
    EMP -->|Job Details| JM
    JM -->|Validated Job Posting| DB
    
    JS -->|Apply Request| APP
    APP -->|Fetch Seekers Profile & Job Requirements| DB
    APP -->|Profile + Requirements| AI
    AI -->|Compatibility Final Score| APP
    APP -->|Application Record| DB
    
    EMP -->|Review Applications| APP
    APP -->|Application Data| EMP
```

### 5.2 Use Case Diagram

```mermaid
flowchart LR
    Job_Seeker([Job Seeker])
    Employer([Employer])
    Admin([Administrator])
    AI_API([LLM Provider - Gemini/OpenAI])
    
    subgraph TalentorAI System
        UC1((Manage Profile))
        UC2((Generate Resume))
        UC3((Analyze Resume))
        UC4((Search Jobs))
        UC5((Submit App))
        
        UC6((Post Jobs))
        UC7((Review Applicants))
        UC8((Update Status))
        
        UC9((Approve Listings))
        UC10((Manage Users))
        UC11((View Analytics))
    end
    
    Job_Seeker --> UC1
    Job_Seeker --> UC2
    Job_Seeker --> UC3
    Job_Seeker --> UC4
    Job_Seeker --> UC5
    
    Employer --> UC6
    Employer --> UC7
    Employer --> UC8
    
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    
    UC2 --> AI_API
    UC3 --> AI_API
    UC7 --> AI_API
```

### 5.3 Class Diagram

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String role
        +Object profile
        +login() token
        +updateProfile()
        +generateResume()
    }

    class Client {
        +ObjectId _id
        +String companyName
        +String industry
        +String subscriptionStatus
        +postJob()
        +reviewApplicant()
    }

    class Job {
        +ObjectId _id
        +ObjectId client_id
        +String title
        +String description
        +Array requirements
        +String status
        +calculateMatchScore()
    }

    class Application {
        +ObjectId _id
        +ObjectId user_id
        +ObjectId job_id
        +String status
        +Object aiAnalysis
        +updateStatus()
    }

    class Resume {
        +ObjectId _id
        +ObjectId user_id
        +String type
        +String content
        +Object feedback
        +exportPDF()
    }

    User "1" -- "0..*" Application : Submits
    User "1" -- "0..*" Resume : Owns
    Client "1" -- "0..*" Job : Posts
    Job "1" -- "0..*" Application : Receives
```

### 5.4 Activity Diagram (Job Application Process)

```mermaid
stateDiagram-v2
    [*] --> Login
    Login --> Dashboard : Authenticated
    
    state Dashboard {
        [*] --> BrowseJobs
        BrowseJobs --> ViewJobDetails
        ViewJobDetails --> SubmitApplication : Matches Interest
    }
    
    SubmitApplication --> AIMatchingEngine
    
    state AIMatchingEngine {
        [*] --> FetchRequirements
        FetchRequirements --> FetchUserProfile
        FetchUserProfile --> SemanticAnalysis
        SemanticAnalysis --> CalculateMatchScore
    }
    
    AIMatchingEngine --> SaveToDatabase
    SaveToDatabase --> NotifyEmployer
    NotifyEmployer --> [*]
```

### 5.5 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ RESUME : owns
    USER ||--o{ APPLICATION : submits
    CLIENT ||--o{ JOB : posts
    JOB ||--o{ APPLICATION : receives
    
    USER {
        string id PK
        string name
        string email
        string role
        string password
    }
    
    CLIENT {
        string id PK
        string user_id FK
        string companyName
        string industry
    }
    
    JOB {
        string id PK
        string client_id FK
        string title
        string description
        string status
    }
    
    APPLICATION {
        string id PK
        string user_id FK
        string job_id FK
        string status
        int matchScore
    }
    
    RESUME {
        string id PK
        string user_id FK
        string content
        string analysis
    }
```

### 5.6 System Architecture Diagram

```mermaid
graph TD
    subgraph Client Tier [Frontend Client Interface]
        UI[React 18 UI / Tailwind CSS]
        STATE[Redux Toolkit State Management]
        HTTP[Axios / Socket.IO Client]
        UI --> STATE
        STATE --> HTTP
    end
    
    subgraph Application Tier [Node.js Backend System]
        API[Express.js API Router]
        MIDDLEWARE[Auth & Rate Limiting Middleware]
        CONTROLLERS[Business Logic Controllers]
        ODM[Mongoose ODM]
        
        HTTP <--> |REST & WebSockets| API
        API --> MIDDLEWARE
        MIDDLEWARE --> CONTROLLERS
        CONTROLLERS --> ODM
    end
    
    subgraph Database Tier [Persistance Layer]
        MONGODB[(MongoDB Cloud Cluster)]
        ODM <--> |Read/Write| MONGODB
    end
    
    subgraph External Services [AI Providers]
        GEMINI[Google Gemini API]
        OPENAI[OpenAI API]
        
        CONTROLLERS <--> |HTTPS Payload/Response| GEMINI
        CONTROLLERS <--> |HTTPS Payload/Response| OPENAI
    end
```
"""

# Extract Chapter 5 part to replace
start_ch5 = text.find("# Chapter 5 \u2013 System Design")
start_ch6 = text.find("# Chapter 6 \u2013 Implementation")

# Handle dash types
if start_ch5 == -1:
    start_ch5 = text.find("# Chapter 5 - System Design")
if start_ch6 == -1:
    start_ch6 = text.find("# Chapter 6 - Implementation")
    
if start_ch5 != -1 and start_ch6 != -1:
    ch5_old = text[start_ch5:start_ch6]
    text = text.replace(ch5_old, ch5_new + "\n\n")

# Expand Chapter 9
ch9_old = """# Chapter 9 \u2013 Conclusion

The development and deployment of the TalentorAI project successfully demonstrate the profound capability of integrating modern web architecture with artificial intelligence to solve complex logistical problems. By migrating the employment search mechanism away from passive directories and toward semantic, active-matching systems, the project establishes a demonstrably superior recruitment paradigm. 

The successful implementation of the platform verified that traditional bottlenecks\u2014specifically the candidate's struggle formatting ATS-compliant resumes and the employer's burden of filtering overwhelming applicant noise\u2014can be mitigated almost entirely through algorithmic intervention. The AI Resume Builder successfully democratized document creation, empowering users across varied skill levels to project maximum professionalism. Conversely, the AI Employer Dashboard demonstrated that preprocessing applicants via an intelligent matching engine produces high-fidelity shortlists, significantly reducing operational resource expenditure on manual screening. Furthermore, the selection of the MERN stack integrated with Redux and Socket.IO proved exceptionally resilient for managing the highly localized, asynchronous events necessary in a multi-role ecosystem, providing an interactive, real-time user experience that mirrors industry-standard enterprise software.

### Learning Outcomes"""

ch9_old_alt = ch9_old.replace("\u2013", "–").replace("\u2014", "—")

ch9_new = """# Chapter 9 – Conclusion

The development and deployment of the TalentorAI project successfully demonstrate the profound capability of practically integrating modern, high-performance web architecture with advanced artificial intelligence models to solve deeply entrenched, complex logistical problems within the human resources sector. By deliberately migrating the conventional employment search mechanism away from passive, static directory listings and shifting decisively toward a dynamic, semantic, active-matching ecosystem, the project has successfully established a demonstrably superior and far more efficient recruitment paradigm. The project validates the hypothesis that introducing an intelligent intermediary layer into the hiring process creates measurable value for all participating stakeholders.

The successful implementation of the platform unequivocally verified that the traditional bottlenecks stalling recruitment pipelines—specifically the candidate's persistent struggle with formatting strictly ATS-compliant resumes and the employer's overwhelming burden of filtering through massive volumes of irrelevant applicant noise—can be mitigated almost entirely through strategic algorithmic intervention. The deployment of the AI Resume Builder module successfully democratized professional document creation, effectively empowering users across a wide spectrum of technical backgrounds and socio-economic skill levels to project maximum professionalism without requiring expensive career-coaching services. Conversely, the functional reality of the AI Employer Dashboard demonstrated that preprocessing vast numbers of applicants via a contextually aware, intelligent matching engine consistently produces high-fidelity candidate shortlists, significantly slashing the operational resource expenditures associated with manual screening. 

Furthermore, the deliberate architectural selection of the MERN stack (MongoDB, Express.js, React, Node.js), intricately integrated with Redux for global state coordination and Socket.IO for real-time bidirectional transmission, proved exceptionally resilient. This robust foundation handled the highly localized, asynchronous data streams necessary in a multi-role, highly concurrent ecosystem effortlessly, providing users with an interactive, real-time interface experience that faithfully mirrors premium, industry-standard enterprise software. Ultimately, TalentorAI bridges the critical communication gap in modern hiring, proving that AI is not merely a tool for automation, but a vital conduit for better connecting human capability with organizational need.

### Learning Outcomes"""

if ch9_old in text:
    text = text.replace(ch9_old, ch9_new)
elif ch9_old_alt in text:
    text = text.replace(ch9_old_alt, ch9_new)

with open("d:\\ai-job-portal\\PROJECT_DOCUMENTATION.md", "w", encoding="utf-8") as f:
    f.write(text)

print("Modification complete. Saved to PROJECT_DOCUMENTATION.md")
