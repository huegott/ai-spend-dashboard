
Product Requirements Document (PRD): AI Spend Dashboard


1. Executive Summary

This document details the requirements for developing a streamlined web application designed to consolidate and visualize AI spending from Anthropic and OpenAI APIs. The primary objective is to furnish users with a clear, unified perspective on their AI expenditures, facilitating enhanced cost management and deeper financial understanding. The application will be constructed within the VSCode development environment, with Claude Code serving as the principal development agent. The user experience and interface are intended to mirror the clarity, interactivity, and ease of use characteristic of contemporary data visualization dashboards.

2. Product Vision & Objectives


2.1. Project Overview

The project aims to establish a web-based dashboard capable of aggregating and presenting AI API usage and associated cost data from both Anthropic and OpenAI. This application will function as a centralized hub, empowering users to effectively monitor their AI spend, discern emerging trends, and comprehend cost distribution across various models and services. The fundamental value proposition lies in transforming disparate raw API usage data into actionable financial intelligence through intuitive and interactive visualizations.

2.2. Problem Statement

Users currently leveraging multiple AI API providers, such as Anthropic and OpenAI, encounter a significant challenge due to the absence of a unified, real-time overview of their aggregate AI spending. This fragmentation inherently complicates several critical aspects of financial management:
Accurately tracking the total AI expenditure across diverse platforms.
Identifying the primary cost drivers and underlying usage patterns.
Forecasting future spending with reasonable precision.
Optimizing the allocation of AI resources to maximize efficiency.
This product directly addresses the issue of scattered and opaque AI billing information by centralizing it within a user-friendly and accessible dashboard.

2.3. Business Goals & Success Metrics

The efficacy of this project will be assessed by its capacity to deliver transparent and actionable insights into AI expenditure.
Goal 1: Enable comprehensive AI spend visibility.
Metric: A target of 90% of users reporting a significantly improved understanding of their total AI spend across all integrated providers within the initial month of utilizing the application. This metric would typically be assessed through structured user feedback mechanisms.
Metric: The daily active user (DAU) count for the dashboard is projected to reach 50% of registered users within three months post-launch. This provides a quantifiable measure of user engagement and perceived value.
Goal 2: Facilitate informed cost optimization decisions.
Metric: Users are expected to identify at least one tangible area for potential cost savings (e.g., transitioning to more cost-effective models, optimizing prompt length for efficiency) within their first week of dashboard usage. This outcome would be evaluated through optional in-application feedback or targeted user surveys.
Goal 3: Provide a reliable and user-friendly experience.
Metric: The average page load time for all dashboard views must consistently remain under 3 seconds, ensuring a responsive user interface.
Metric: A user satisfaction score (CSAT) of 4.5 out of 5 or higher is targeted, reflecting overall positive user sentiment towards the application.
For an AI development agent, such as Claude Code, the precision of these success metrics is paramount. While a human team might interpret "improved understanding" broadly, an AI requires concrete, measurable proxies to guide its development efforts. For instance, "90% of users report improved understanding" translates into a requirement for a feedback mechanism (like a survey) that the application's design must accommodate. Similarly, "Daily active users (DAU) reaches 50%" is a directly quantifiable metric derived from application analytics, providing clear performance targets. The "average page load time" is a direct technical performance indicator that Claude Code can explicitly optimize for. The user satisfaction score, while qualitative, underscores the underlying purpose of the features being built, steering design choices towards maximizing user value. This explicit connection between high-level objectives and measurable outcomes is crucial for iterative AI development, allowing the AI to "learn" what constitutes a successful product from a user-centric perspective.

3. User Experience (UX) & User Interface (UI) Design

The application's UI/UX design will prioritize clarity, interactivity, and effortless data consumption, drawing inspiration from established professional data visualization tools.

3.1. Target User Persona(s)

Primary User: Individual Developer / Small Team Lead
Needs: This persona requires a rapid overview of daily and monthly AI spend, a clear breakdown of costs by model and service, immediate identification of unexpected cost spikes, and the capability to attribute costs to specific projects or API keys.
Technical Comfort: While comfortable with APIs and fundamental web interfaces, this user prefers concise visual summaries over extensive raw data tables for quick comprehension.
Secondary User: Product Manager / Business Analyst
Needs: This persona seeks high-level cost trends, comparative analysis between different AI providers, total spend aggregated over extended periods, and the ability to export summary data for external reporting.
Technical Comfort: Typically less technical than the primary user, this persona relies heavily on intuitive dashboards and clearly presented reports for decision-making.

3.2. Core User Scenarios & Flows

Initial Setup:
Upon accessing the application, the user is presented with a clear prompt to securely input their OpenAI API Key(s) and Anthropic API Key(s).
These keys are then securely stored, ideally through environment variables or a robust local storage mechanism, to ensure confidentiality.
Following key input, the application initiates the process of fetching initial AI spend data from the configured providers.
Viewing Overall Spend:
After successful configuration (and login, if a future authentication layer is introduced), the user is directed to the main dashboard.
This dashboard prominently displays a consolidated summary of total AI spend across all integrated providers for a user-selected period (e.g., the current month or the last 30 days).
Dynamic visualizations illustrate overarching spending trends over time, providing immediate context.
Drilling Down into Provider-Specific Spend:
The user can interact with the dashboard by clicking on a specific provider (e.g., "OpenAI") or applying a provider-specific filter.
The dashboard dynamically updates to present detailed spend information pertinent to the selected provider, including usage metrics broken down by model, project, or individual API key.
Analyzing Cost Breakdown:
The user can access charts that segment costs by specific AI model, service type (e.g., chat completions, embeddings), or, if supported by the underlying APIs, by custom tags.
Adjusting Timeframes:
An intuitive date range selector allows the user to easily switch between predefined periods (e.g., "Today," "Last 7 Days," "Last Month," "Custom Range") to review historical spend data.

3.3. Visual & Interaction Design Inspiration

The dashboard's visual and interaction design will embody the clean, intuitive, and highly interactive characteristics found in professional data visualization platforms. While "airspend.io" was referenced in the user query, a closer examination of available information suggests focusing on the capabilities and principles of such tools rather than attempting to replicate a specific, non-existent external UI.
Inspiration is drawn from two key sources:
Cloudera Data Visualization 1:
This platform emphasizes "Self-service visualization tools," "intuitive and accessible drag-and-drop dashboards," "out-of-the-box visualizations," a "dashboard builder," and "data modeling." These elements collectively suggest a design philosophy centered on pre-defined, interactive charts and the ability to seamlessly integrate and combine data from disparate sources, prioritizing user-friendliness and visual clarity. The inclusion of AI-powered dashboards and natural language interfaces also points to a desire for intelligent data exploration.
Apache Superset 2:
This tool reinforces the desired design principles through phrases such as "Powerful yet easy to use," offering both a "no-code viz builder" and a "state-of-the-art SQL IDE." It boasts "rich visualizations and dashboards" with over 40 pre-installed types, supporting "drag and drop to create robust charts and tables." Key features like "data caching for faster load time," "Jinja templating and dashboard filters for creating interactive dashboards," and "cross-filters, drill-to-detail" further define a highly interactive, filterable, and visually comprehensive dashboard experience.
For an AI developer, such as Claude Code, it is important to clearly define the functional and visual requirements. The reference to "airspend.io" is interpreted not as a literal UI to replicate, but as a conceptual model for a spend visualization dashboard. Therefore, Claude Code is directed to implement the functionality and design principles exemplified by these robust data visualization tools: clear and concise charts, interactive filters, flexible time-range selection, and an overall clean, intuitive layout. This approach ensures that the developed product aligns with the user's underlying need for effective spend visualization, even if the initial reference was imprecise.

3.4. Key Dashboard Components

The dashboard will feature interactive charts and summary metrics to provide a comprehensive overview of AI spend.
Total Spend Summary: This component will prominently display the current month's total spend in USD, alongside the previous month's total spend. It will also calculate and present the percentage change month-over-month, accompanied by a clear visual indicator (e.g., green for a decrease, red for an increase). The visual representation will be a prominent numerical display, potentially augmented with a small sparkline to illustrate recent trends.
Daily/Weekly/Monthly Spend Trend: A dynamic line graph will illustrate cumulative or daily spend over a user-selected period. This visualization will support hover-over functionality, enabling users to reveal precise spend details (date and amount) for each data point.
Spend by Provider: A bar chart or pie chart will clearly depict the total spend distributed between Anthropic and OpenAI. Each segment or bar within this chart will be interactive, allowing the user to filter the entire dashboard to display details specific to that selected provider.
Spend by Model (per provider): A bar chart will provide a detailed breakdown of spend for each specific AI model (e.g., gpt-4o, claude-opus-4). This component will support drill-down functionality, allowing users to access more granular usage details for a selected model.
Spend by API Key / Project (OpenAI only): A data table or bar chart will present spend attributed to different API keys or projects, as provided by the OpenAI API.3 The columns within this table should be sortable, and a search/filter bar for API key IDs or project names will be included to facilitate data exploration.
Usage Metrics (Tokens/Requests): A line graph or bar chart will display the volume of input/output tokens or the total number of requests over time. This visualization will offer an interactive toggle, allowing users to switch between viewing token counts and request counts.
The following table provides a definitive blueprint for Claude Code, explicitly linking each planned UI component to its data source, the type of visualization, and the key metrics it is expected to display. This ensures a clear understanding of the visual output requirements and the underlying data needed to generate them. This level of detail is critical for an AI developer to accurately construct the user interface and connect it to the appropriate data.
Table: Dashboard Components & Data Sources
Dashboard Section/Component
Data Source
Visualization Type
Key Metrics Displayed
Total Spend Summary
OpenAI Costs API, Anthropic Console (Manual Input/Calculated)
Large Numerical Display, Sparkline
Total USD, Percentage Change MoM
Daily/Weekly/Monthly Spend Trend
OpenAI Usage API, OpenAI Costs API, Anthropic Console (Manual Input/Calculated)
Line Graph
Daily/Cumulative USD, Date
Spend by Provider
OpenAI Costs API, Anthropic Console (Manual Input/Calculated)
Bar Chart, Pie Chart
Total USD per provider
Spend by Model (per provider)
OpenAI Usage API, Anthropic Console (Calculated from Usage)
Bar Chart
USD per model, Model Name
Spend by API Key / Project (OpenAI)
OpenAI Usage API, OpenAI Costs API
Data Table, Bar Chart
USD per API Key/Project, API Key ID, Project Name
Usage Metrics (Tokens/Requests)
OpenAI Usage API, Anthropic Console (Calculated from Usage)
Line Graph, Bar Chart
Input Tokens, Output Tokens, Number of Requests, Model Name


4. Functional Requirements


4.1. Data Ingestion

The application must securely connect to and retrieve usage and cost data from specified AI providers.

4.1.1. OpenAI API Integration

The application will implement robust integration with the OpenAI API to retrieve comprehensive spend data.
Authentication: API keys will be utilized for authentication, and these must be transmitted via HTTP Bearer authentication in the request headers.4 It is imperative that API keys are loaded securely from environment variables or a server-side key management service and are never exposed within client-side code (browsers, applications).4
Endpoints for Data Retrieval:
Usage Data: The /v1/organization/usage/{completions, images, audio, embeddings, moderations, vector_stores, code_interpreter_sessions} endpoint will be employed to retrieve real-time API activity data.3
Query Parameters: The application must support filtering results by start_time and end_time (specifying the date and time range), interval (1m, 1h, 1d for desired granularity), project_ids, user_ids, api_key_ids, and models.3 This comprehensive filtering capability is essential for enabling granular reporting and dynamic filtering on the dashboard.
Expected Response Fields: API responses from usage endpoints typically include a usage key containing prompt_tokens, completion_tokens, and total_tokens.5 For the
/v1/organization/usage endpoint, additional fields such as input_tokens, output_tokens, num_model_requests, project_id, user_id, api_key_id, model, and batch are anticipated, particularly when the group_by parameter is utilized.6
Costs Data: The /v1/organization/costs endpoint will be used to obtain a detailed breakdown of API spend by invoice line item.3
Query Parameters: This endpoint supports specifying a query time range (start_time, end_time) with daily granularity (interval=[1d]). Costs can also be filtered and grouped by project_ids.3
Expected Response Fields: While specific JSON schema fields for this endpoint are not explicitly detailed in the provided documentation 3, the system should anticipate fields related to monetary
cost, line_item descriptions (e.g., "chat completions," "embeddings"), and potentially associated usage metrics if returned directly. Claude Code should consult the latest API documentation or perform direct API calls to infer the precise structure.
Rate Limit Handling: Robust retry mechanisms with exponential backoff must be implemented to effectively manage rate limit errors, which are indicated by x-ratelimit-limit-* and x-ratelimit-remaining-* headers.4 OpenAI enforces rate limits across five dimensions: Requests Per Minute (RPM), Requests Per Day (RPD), Tokens Per Minute (TPM), Tokens Per Day (TPD), and Images Per Minute (IPM), applied at both the organization and project levels.7
Pricing Data (for reference/validation): The application should maintain awareness of OpenAI's detailed pricing structure 9 for various models (e.g.,
gpt-4o, gpt-4.1, gpt-3.5-turbo). This includes input/output token costs, cached input costs, and specific costs for built-in tools like Code Interpreter, File Search, and Web Search. This pricing information can serve as a reference for validating or supplementing direct cost API calls, or as a fallback for cost calculation if discrepancies arise.
The programmatic access to OpenAI's usage and cost data, coupled with extensive filtering capabilities, directly addresses the user's need for detailed breakdowns of AI spending. The OpenAI API documentation explicitly details that the /v1/organization/usage and /v1/organization/costs endpoints allow filtering by start_time, end_time, interval, project_ids, user_ids, api_key_ids, and models.3 This capability is crucial because the user's request for "all of my AI spending" implies a need for granular insights, not merely a total sum. For example, a user may wish to analyze the expenditure of a specific team (identifiable by
user_id or api_key_id) or a particular project (project_id) on a certain model (model). Therefore, Claude Code must be explicitly instructed to leverage these precise API parameters when constructing backend queries. This ensures that the dashboard can provide granular, insightful breakdowns of costs and usage, directly fulfilling the implicit user requirement for detailed categorization and analytical capabilities beyond a high-level overview.

4.1.2. Anthropic API Integration

Integration with the Anthropic API presents a distinct set of considerations, particularly regarding data retrieval for billing information.
Authentication: The Anthropic API necessitates an x-api-key header for authentication.11 Consistent with OpenAI, these API keys must be securely stored and managed on the server-side, never exposed client-side.
Endpoints for Data Retrieval:
CRITICAL LIMITATION: A comprehensive review of the provided documentation 12 consistently indicates that Anthropic's primary method for users to track credit usage and billing is through their "Console settings on the Billing page." There is no explicit mention or documentation of a programmatic API endpoint specifically designed for retrieving historical billing/spend data or current credit usage. While Anthropic's API documentation 11 details model invocation (e.g., Messages API), administration, and third-party platform integrations (such as Amazon Bedrock and Vertex AI), it does not provide a direct financial cost or credit balance API from Anthropic's own billing system. Although Bedrock offers an "invocation logging service" that records prompts and completions 14, this provides
usage data (e.g., token counts) but does not directly expose financial cost information programmatically from Anthropic's billing system.
Proposed Workaround (Initial Phase): Given this significant and currently unaddressed limitation, this PRD must explicitly state that direct programmatic access to Anthropic billing spend is not feasible with the currently documented APIs. For the initial version of the application, the following approach will be necessary:
Manual Data Entry/Upload: A user interface will be provided to allow users to manually input their current Anthropic credit balance or upload CSV files containing their usage/spend data, if such export functionality is available from the Anthropic Console's billing page. This serves as a temporary measure to enable some level of Anthropic data inclusion within the dashboard.
Future Consideration: It is crucial to note that if Anthropic introduces a programmatic billing API in the future, the system should be designed with the flexibility to integrate it seamlessly, allowing for a more automated and comprehensive data pull.
Pricing Data (for inference/validation): The application should be aware of Anthropic's published pricing structure 17 for its various models (e.g., Claude Opus, Sonnet, Haiku), which is typically based on input/output tokens. This pricing data is vital if spend needs to be
inferred from usage logs (e.g., from Bedrock invocation logs, if accessed) rather than relying on direct billing data. Such inference would involve multiplying the token usage by the corresponding model pricing.
The user's core requirement is to pull AI spend information from both Anthropic and OpenAI APIs. However, the apparent lack of a direct programmatic API for Anthropic's historical billing/spend data creates a significant challenge, contrasting sharply with OpenAI's robust offerings. This disparity means that the core goal of comprehensive, automated spend tracking cannot be fully achieved for Anthropic in the initial version of the application. The dashboard will inherently exhibit data asymmetry between the two providers. This critical limitation necessitates an explicit acknowledgment in the PRD to manage user expectations and guide Claude Code away from attempting to implement a non-existent API integration. The initial scope for Anthropic spend visualization will thus be constrained, potentially requiring manual data input or focusing solely on usage metrics (if inferred from invocation logs, which do not provide direct cost). This architectural challenge dictates that the data ingestion layer must be highly flexible, accommodating direct and robust API calls for OpenAI while simultaneously providing a fallback mechanism (like manual input or placeholders for future API integration) for Anthropic. Claude Code must be explicitly aware of this, as it will influence the design of the backend data processing, the underlying data model, and the user interface for inputting and displaying Anthropic data.
The following table serves as a definitive, at-a-glance guide for Claude Code, detailing how to access and interpret data from each API. Crucially, it highlights the significant limitation regarding Anthropic's programmatic billing data. This centralizes vital technical information and ensures no critical details are overlooked during development.
Table: API Data Mapping & Limitations

API Provider
Endpoint/Method
Authentication Method
Key Data Fields (Expected)
Notes/Limitations
OpenAI
/v1/organization/usage
Bearer Token (API Key)
input_tokens, output_tokens, num_model_requests, project_id, user_id, api_key_id, model, batch
Programmatic access available; supports granular filtering by time, project, user, API key, and model. 3
OpenAI
/v1/organization/costs
Bearer Token (API Key)
cost, line_item, project_ids (for filtering/grouping)
Programmatic access available; provides breakdown by invoice line item. 3
Anthropic
Anthropic Console (Manual)
N/A (Web UI)
Credit Balance, Usage Details (requires manual export/input)
No direct programmatic billing API found in documentation for historical spend or credit balance. 12
Anthropic
N/A (Inference from Usage)
x-api-key header (for model invocation)
Input/Output Tokens, Model Name
Spend can be inferred by applying published pricing to token usage if invocation logs are available (e.g., via Bedrock invocation logging). 14


4.2. Data Processing & Storage

Effective data processing and secure storage are fundamental to the application's functionality and performance.
Data Transformation: Raw API responses, which will inherently differ in structure between OpenAI and Anthropic, will be meticulously parsed and normalized into a consistent internal data model. This ensures a unified schema for all spend data, enabling seamless aggregation and display across the dashboard. Timestamps obtained from API responses will be converted to a standard format, such as UTC, to facilitate consistent historical analysis. Granular usage data will be further aggregated into daily and monthly totals, providing the necessary data points for various dashboard views. In scenarios where Anthropic spend needs to be inferred from usage data (e.g., from Bedrock invocation logs), the application will apply Anthropic's publicly available pricing 17 to the token counts to generate an estimated cost.
Data Storage: PostgreSQL running in a Docker container will be employed for persistent storage of fetched API data. This choice is crucial for several reasons: it provides ACID compliance for financial data integrity, enables the maintenance of historical trends, ensures rapid dashboard loading (as data caching significantly improves load times 2), and reduces the frequency of repeated API calls, thereby mitigating potential rate limit issues and unnecessary costs. API keys will be managed through Docker secrets, providing secure storage and access within the containerized environment. The PostgreSQL setup will include proper indexing on date and provider fields to optimize query performance for dashboard visualizations.
Data Retention: To support comprehensive year-over-year comparisons and long-term trend analysis, data will be retained for a minimum of 12 months.
The requirement to display data from different providers and to deliver a "simple website" with optimal performance dictates specific data handling strategies. OpenAI provides detailed usage and cost data directly, whereas Anthropic, as identified, lacks a direct programmatic billing API, offering usage/credit data primarily through its console or via inference from invocation logs. These disparate data sources will naturally have varying formats and granularities. To present this heterogeneous data cohesively on a unified dashboard, it is essential to transform and normalize it into a common, consistent internal data model. This model should include fields such as date, provider, model_name, cost_usd, input_tokens, and output_tokens, ensuring that charts and filters can operate on a single, coherent dataset. Repeatedly fetching large volumes of historical data from APIs can lead to encountering rate limits 7 and incurring unnecessary costs. Therefore, storing this data locally, as suggested by the emphasis on data caching for faster load times 2, is critical for both performance (enabling quicker dashboard rendering) and cost optimization (reducing the number of API calls). Claude Code is expected to implement this crucial data normalization and persistent local storage layer. This implies a distinct backend component responsible for orchestrating API calls, performing the necessary data transformations, and interacting with the chosen database. This clear separation of concerns ensures that the frontend can focus exclusively on rendering, resulting in a more efficient and responsive application.

4.3. Data Visualization & Reporting

The application's core interface will be a dynamic and interactive Single-Page Application (SPA) dashboard, providing intuitive visualizations of AI spend.
Dashboard View: The primary interface will be a single-page application (SPA) dashboard, offering interactive and dynamic visualizations of AI spend.
Filtering & Time Range Selection:
A global date range picker will be implemented, allowing users to select predefined periods (e.g., "Last 7 days," "Last 30 days," "Last Month," "Current Month") or define a "Custom range" using an intuitive calendar interface.
A filter will be provided to toggle between displaying data for "OpenAI," "Anthropic," or "All" providers, enabling focused analysis.
A model filter will be included, empowering users to select specific AI models (e.g., "GPT-4o," "Claude Opus") to narrow down the displayed data to their areas of interest.
For OpenAI data, a dedicated project/API Key filter will be implemented, allowing users to segment and analyze spend based on their configured projects or individual API keys.
Interactive Charts: All charts displayed on the dashboard must support hover effects, which will reveal precise data points (e.g., exact cost, token count) when the user hovers over a specific part of the visualization. Additionally, clickable elements within charts (e.g., segments of a pie chart, individual bars in a bar chart) will enable users to drill down into more detail or dynamically apply filters to the rest of the dashboard, enhancing interactivity.
Export Functionality (Future Consideration): While not a critical requirement for the initial version (V1), future iterations may include an option to export displayed data in formats such as CSV or as an image (e.g., PNG) for external reporting or sharing purposes.

4.4. User Management

For this initial version, user management will focus on secure API key handling and basic configuration.
API Key Management: A simple, secure interface will be provided for users to input and update their OpenAI and Anthropic API keys. Given the requirement for a "simple website," these keys should be stored securely (e.g., in environment variables for a local setup, or a simple encrypted file for development/single-user persistence). Full multi-user authentication and complex authorization roles are explicitly outside the scope of V1, which prioritizes a single-user, local experience.
Basic Configuration: The application will offer basic configuration options, such as allowing the user to set a preferred currency for cost display if future enhancements require handling currency conversions beyond USD (with USD serving as the default, as API costs are typically denominated in USD).

5. Technical Requirements & Architecture


5.1. Technology Stack

The selection of the technology stack is guided by the user's explicit request for a "simple website" and the utilization of VSCode with Claude Code as the development agent.
Development Environment: VSCode, as specified by the user, will be the primary integrated development environment, indicating a standard developer workflow.
AI Development Agent: Claude Code will serve as the AI development agent, necessitating highly structured, unambiguous, and executable instructions within this document.
Frontend: A modern JavaScript framework such as React, Vue, or Svelte will be employed for constructing an interactive Single-Page Application (SPA). These frameworks are well-suited for developing dynamic dashboards and delivering a rich user experience.1
Backend: A Node.js environment (leveraging Express.js or a similar lightweight framework) or a Python environment (with Flask or FastAPI) will be utilized. This backend component is indispensable for securely managing API keys, making server-side API calls to external services, and performing necessary data processing before serving it to the frontend.
Database: PostgreSQL will be deployed within a Docker container as part of a Docker Compose setup, providing robust data persistence with ACID compliance for financial data. This approach maintains the "simple website" requirement through containerization while offering production-ready database capabilities, proper concurrent access handling, and reliable backup/restore procedures.
The user's explicit request for a "simple website" is fulfilled through containerization with Docker Compose, which provides ease of setup and straightforward deployment while maintaining production-ready capabilities. The PostgreSQL-in-Docker approach eliminates the need for separate database installation while providing ACID compliance crucial for financial data integrity. This containerized architecture enables the application to be deployed with a single `docker-compose up` command, maintaining simplicity while offering robust data persistence, backup capabilities, and a clear migration path to managed database services if needed. The Docker Compose setup ensures environment consistency, network isolation, and proper secrets management for API keys, aligning with both the simplicity requirement and the production deployment needs at https://10.10.10.20:9443.

5.2. API Integration Details

Detailed considerations for robust and secure API integration are critical for the application's reliability.
API Keys: A secure mechanism will be implemented to load API keys from environment variables (e.g., a .env file for local development) on the server-side. This ensures that API keys are never hardcoded or exposed in client-side code.4
Rate Limit Handling: For OpenAI APIs, robust client-side and server-side logic will be implemented to detect and gracefully handle rate limit responses. This includes implementing retries with exponential backoff, a strategy explicitly recommended by OpenAI.7
Error Handling: Comprehensive and graceful error handling will be implemented for all API interactions. This encompasses catching and managing network errors, invalid API keys, rate limit errors, and other API-specific error codes. User-friendly messages will be displayed to guide the user in resolving any encountered issues.
Data Refresh: A mechanism for periodic data refresh (e.g., a daily scheduled task) will be implemented to ensure that the dashboard consistently displays reasonably up-to-date information. Additionally, a manual "Refresh Data" button will be provided on the user interface for on-demand updates.

5.3. Scalability & Performance

The initial phase of development will prioritize core functionality and a single-user experience.
Initial Scope: The initial version of the application will concentrate on a single-user, local deployment. Considerations for multi-user scalability or handling high traffic loads are explicitly deferred to subsequent development phases.
Performance Optimization:
Efficient API Calls: Strategies will be implemented to minimize redundant API calls, such as caching fetched data locally within the application. Where applicable and beneficial, the potential for batching requests (e.g., utilizing OpenAI's Batch API for specific use cases 18) will be explored to reduce the number of individual API calls and optimize resource usage.
Client-Side Data Caching: Client-side caching mechanisms will be employed to store fetched and processed data. This will minimize the need to re-fetch data from the backend or external APIs for frequently accessed dashboard views, contributing to faster load times.2
Optimized Data Rendering: Data visualization libraries and rendering logic will be optimized to efficiently handle and display potentially large datasets, ensuring a responsive and fluid user experience even as data volume grows.

5.4. Security & Data Privacy

Security and data privacy are paramount, even for a simple, local application.
API Key Security: It is a fundamental requirement that API keys must never be exposed in client-side code.4 All API calls necessitating keys must originate exclusively from the server-side component of the application. For local storage of API keys, consideration will be given to basic encryption or hashing to provide an additional layer of protection, even in a single-user setup.
Data Storage Security: The local database file (e.g., SQLite file) will be protected by appropriate file system permissions to prevent unauthorized access, ensuring the integrity and confidentiality of stored data.
User Data: The application will adhere to a principle of data minimization, collecting only the essential personal user data. The primary focus will be on API keys and the usage/cost data retrieved directly from the AI providers. No personally identifiable information (PII) beyond what is strictly necessary for API interaction will be stored.
Compliance: For a simple, locally deployed tool, formal compliance with extensive regulations such as GDPR or HIPAA is outside the scope of this initial project. However, general good security and data privacy practices—including data minimization, secure storage, and access control—will be followed as a matter of fundamental principle.

6. Release Plan & Milestones

This project will adopt an agile development methodology, characterized by iterative cycles designed to rapidly deliver core functionality and subsequently enhance it.
Phase 1: Core Data Ingestion & Basic Dashboard (Target: 2 weeks)
Establish the foundational project structure, encompassing the frontend, backend, and database initialization.
Implement robust OpenAI API integration for retrieving both usage and cost data, including secure authentication and basic error handling.
Integrate the Anthropic data placeholder, explicitly acknowledging the data limitation and providing a mechanism for manual input or clear user communication regarding this constraint.
Develop the initial dashboard view, displaying total AI spend, a rudimentary daily spend trend line, and a high-level breakdown by provider.
Phase 2: Enhanced Visualizations & Filtering (Target: 2 weeks)
Implement detailed, model-specific spend charts for both integrated providers (where programmatic data is available).
Add comprehensive date range selection and provider filters to the user interface, significantly enhancing data exploration capabilities.
Integrate OpenAI's project/API key filtering capabilities, allowing for more granular cost analysis.
Refine the UI/UX based on the conceptual inspiration derived from professional data visualization tools (Cloudera/Superset features), prioritizing interactivity and visual clarity.
Phase 3: MCP Integrations & Docker Deployment (Target: 2 weeks)
Implement MCP server integrations for Portainer, GitHub, n8n, and Asana to enable comprehensive project management capabilities.
Configure Docker containerization with proper port mapping for deployment at https://10.10.10.20:9443.
Implement comprehensive error handling across all API calls and data processing logic, ensuring application stability.
Finalize robust API key management and secure storage mechanisms within the Docker environment.
Conduct thorough performance optimizations to ensure smooth data loading and rendering, providing a responsive user experience.

Phase 4: Refinement & Final Deployment (Target: 1 week)
Complete integration testing of all MCP connections and Docker deployment.
Finalize documentation for Docker deployment and MCP configuration.
Conduct final performance optimizations and security hardening for production deployment.

7. Open Questions & Future Considerations


5.5. Deployment Environment

The application will be deployed within a Docker container environment to ensure consistency and portability.

Docker Compose Deployment: The application will be deployed using Docker Compose, with the web application accessible at https://10.10.10.20:9443. The setup will include both the Node.js/Python application container and a PostgreSQL database container, providing isolated and reproducible deployment environment.

Container Configuration: The Docker Compose configuration will include:
- Application container: Node.js/Python backend with React/Vue frontend
- PostgreSQL container: Database with persistent volume mounting
- Shared Docker network for secure inter-container communication
- Docker secrets management for API keys and database credentials
- SSL/TLS configuration for HTTPS access

Volume Management: PostgreSQL data will be persisted using Docker volumes to ensure data survives container restarts and updates. Database initialization scripts will be mounted to set up the schema on first deployment.

Port Management: The application will be configured to listen on internal port 3000/8000 and be accessible through the specified external endpoint (9443) via proper port mapping with SSL termination.

5.6. MCP (Model Context Protocol) Integrations

The application will integrate with multiple MCP servers to provide enhanced project management and development workflow capabilities.

Portainer MCP Integration: Integration with Portainer's MCP server (https://github.com/portainer/portainer-mcp) will enable programmatic interaction with the Portainer API for container management and deployment automation. This will allow the dashboard to potentially trigger builds, manage container lifecycles, and retrieve deployment status information.

GitHub MCP Integration: The GitHub MCP server (https://github.com/github/github-mcp-server) will be integrated to provide seamless interaction with GitHub repositories, enabling tracking of code-related items, pull requests, issues, and development progress directly within the dashboard context.

n8n MCP Integration: Integration with the n8n MCP server (https://github.com/czlonkowski/n8n-mcp) will enable workflow automation capabilities, allowing the dashboard to trigger automated processes and integrate with various external services through n8n's extensive connector ecosystem.

Asana MCP Integration: An Asana MCP integration will be implemented to track high-level project items and non-technical to-do items that complement the code-focused items managed in GitHub. This dual-tracking approach ensures comprehensive project management coverage:
- Technical items: Tracked in GitHub (issues, PRs, code tasks)
- Non-technical items: Tracked in Asana (business requirements, documentation, stakeholder communications)
- High-level milestones: Coordinated between both platforms

The MCP integrations will provide a unified interface for project management, allowing the AI spend dashboard to serve not only as a cost visualization tool but as a central hub for development and project coordination activities.

7.1. Open Questions

Addressing these questions is crucial for future development and strategic planning:
Anthropic Programmatic Billing API: Is there any undocumented or private API available from Anthropic for retrieving billing data that could be explored or formally requested? This remains a critical factor for achieving full feature parity with OpenAI's data insights.
MCP Server Configuration: What specific authentication methods and configuration parameters will be required for each MCP server integration? How should API keys and connection details be managed securely within the Docker environment?
Container Orchestration: Will the application require integration with container orchestration platforms beyond Portainer? What level of container lifecycle management should be exposed through the dashboard interface?

7.2. Future Considerations (Icebox)

These items represent potential enhancements for future development cycles, to be considered once the core functionality is robust and stable:
Cost Forecasting: Implement predictive analytics capabilities based on historical spend patterns to forecast future expenditures, aiding in budget planning.
Alerting: Develop functionality allowing users to set up customizable alerts for spend thresholds or to detect unusual spikes in usage, providing proactive cost management.
Budget Management: Introduce features for users to define specific budgets for their AI spend and track their progress against these predefined limits.
Additional AI Providers: Expand integration to include other major AI APIs (e.g., Google Cloud AI, AWS Bedrock for a wider range of models, Hugging Face APIs) to provide a truly comprehensive view of AI spending across the ecosystem.
Custom Tags/Projects: Enable users to define and apply custom tags or project categories to their usage data, even if not directly supported by the provider APIs, for more flexible and personalized reporting and analysis.
Advanced Data Export: Provide more sophisticated data export options, such as customizable PDF reports or direct export to widely used spreadsheet formats (e.g., Microsoft Excel).
AI-Powered Summaries: Integrate a large language model (such as Claude itself, leveraging capabilities similar to "AI Visual" in dashboards 1) to generate natural language summaries, explanations, or actionable recommendations based on the analyzed spend data, providing deeper, context-aware insights.

Conclusions

The development of this AI Spend Dashboard presents a clear path to providing users with much-needed visibility into their Anthropic and OpenAI expenditures. The detailed requirements for data ingestion, processing, visualization, and security lay a solid foundation for a functional and user-friendly application.
A key observation from the analysis is the disparity in programmatic data access between OpenAI and Anthropic. While OpenAI offers comprehensive APIs for both usage and cost data, Anthropic's current documentation points primarily to manual console access for billing information. This means that for the initial version, a direct, automated pull of Anthropic's financial spend data is not feasible. The proposed workaround of manual data input or inference from usage logs (if available, e.g., via Bedrock invocation logs) is a necessary interim solution. This architectural consideration highlights the need for a flexible data ingestion layer that can accommodate varying levels of API support from different providers.
The focus on a "simple website" for local deployment guides the technical choices towards lightweight solutions like SQLite and common JavaScript/Python frameworks. This approach minimizes setup complexity and allows for rapid development of core features. As the project evolves, the "Future Considerations" section provides a strategic roadmap for expanding functionality, including potential multi-user support, cloud deployment, and integration with additional AI providers, which would necessitate a re-evaluation of the initial architectural decisions.
In summary, the project is well-defined with clear objectives and a phased release plan. The primary challenge lies in the current limitations of Anthropic's public API for billing data, which will require careful management of user expectations and a flexible design to allow for future enhancements should Anthropic provide programmatic access. The success metrics, particularly those related to user understanding and satisfaction, will serve as crucial indicators of the application's value and effectiveness in helping users manage their AI spend.
Works cited
Cloudera Data Visualization, accessed August 7, 2025, https://www.cloudera.com/products/cloudera-data-platform/data-visualization.html
Welcome | Superset, accessed August 7, 2025, https://superset.apache.org/
Usage Dashboard (Legacy) | OpenAI Help Center, accessed August 7, 2025, https://help.openai.com/en/articles/8554956-usage-dashboard-legacy
API Reference - OpenAI Platform, accessed August 7, 2025, https://platform.openai.com/docs/api-reference/introduction
How do I check my token usage? - OpenAI Help Center, accessed August 7, 2025, https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage
How to use the Usage API and Cost API to monitor your OpenAI usage - OpenAI Cookbook, accessed August 7, 2025, https://cookbook.openai.com/examples/completions_usage_api
Rate limits - OpenAI API, accessed August 7, 2025, https://platform.openai.com/docs/guides/rate-limits/usage-tiers
Rate limits - OpenAI API, accessed August 7, 2025, https://platform.openai.com/docs/guides/rate-limits
Pricing - OpenAI API, accessed August 7, 2025, https://platform.openai.com/docs/pricing
OpenAI API Pricing | Automated Cost Calculation - Apidog, accessed August 7, 2025, https://apidog.com/blog/openai-api-pricing/
Overview - Anthropic API, accessed August 7, 2025, https://docs.anthropic.com/en/api/overview
How do I pay for my API usage? | Anthropic Help Center, accessed August 7, 2025, https://support.anthropic.com/en/articles/8977456-how-do-i-pay-for-my-api-usage
How can I access the Anthropic API?, accessed August 7, 2025, https://support.anthropic.com/en/articles/8114521-how-can-i-access-the-anthropic-api
Amazon Bedrock API - Anthropic, accessed August 7, 2025, https://docs.anthropic.com/en/api/claude-on-amazon-bedrock
Create an Anthropic inference endpoint | Elasticsearch API documentation, accessed August 7, 2025, https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-inference-put-anthropic
Anthropic Claude API: The Ultimate Guide | Zuplo Blog, accessed August 7, 2025, https://zuplo.com/blog/2025/04/09/anthropic-api
Pricing - Anthropic, accessed August 7, 2025, https://www.anthropic.com/pricing
Batch API - OpenAI Platform, accessed August 7, 2025, https://platform.openai.com/docs/guides/batch
