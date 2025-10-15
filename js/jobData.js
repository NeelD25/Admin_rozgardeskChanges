// Job Data Management System - PUBLIC VERSION (embedded data)

// ===== AUTO-GENERATED: DO NOT EDIT MANUALLY =====
window.AVAILABLE_BLOG_POSTS = [
    "Bihar_SI.html",
    "DSSSBPRT.html",
    "ssc_cpo.html",
    "RRBNTPC_ShortNotice.html",
    "frg.html"
];
// ===== END AUTO-GENERATED =====

class JobDataManager {
    constructor() {
        this.jobs = [
        {
                "title": "RRB NTPC Recruitment 2025-26 (Short Notice) - Apply for Station Master, Clerk and Other Posts",
                "department": "Railway",
                "posts": 8850,
                "location": "All India",
                "minAge": 18,
                "maxAge": 33,
                "qualification": "Graduate, Undergraduate, 12th Pass",
                "lastDate": "2025-11-20",
                "blogPost": "blog-posts/RRBNTPC_ShortNotice.html",
                "description": "",
                "id": "job_1760556825320_45f2euhnn",
                "postedDate": "2025-10-15",
                "status": "active"
        },
        {
                "id": "job_1760036023394_hchwypiam",
                "title": "DSSSB PRT Vacancy 2025 Out",
                "department": "Education",
                "posts": 1180,
                "location": "Delhi",
                "minAge": 18,
                "maxAge": 30,
                "qualification": "Graduation and a two-year Diploma in Elementary Education, CTET/Primary Education Certificate",
                "lastDate": "2025-10-16",
                "blogPost": "blog-posts/DSSSBPRT.html",
                "description": "The Delhi Subordinate Services Selection Board (DSSSB) has officially released the DSSSB Notification 2025 (Advt. No. 05/2025) for 1180 Primary Assistant Teacher (PRT) vacancies under the Directorate of Education and New Delhi Municipal Council (NDMC) departments.",
                "postedDate": "2025-10-09",
                "status": "active"
        },
        {
                "id": "job_1760035785925_9pncg385r",
                "title": "Bihar Police Vacancy Out / RECRUITMENT FOR SUB INSPECTOR OF POLICE",
                "department": "Police",
                "posts": 614,
                "location": "Bihar",
                "minAge": 20,
                "maxAge": 37,
                "qualification": "Bachelor’s degree in any stream",
                "lastDate": "2025-10-26",
                "blogPost": "blog-posts/Bihar_SI.html",
                "description": "The Bihar Police SI Vacancy 2025 notification has been released by the Bihar Police Subordinate Services Commission (BPSSC) for 1,799 Sub-Inspector (Daroga) posts. The online application process will be active from 26th September to 26th October 2025 at bpssc.bih.nic.in. Candidates must have a graduate degree from a recognized university, and the age limit is between 20 to 37 years (relaxation as per government norms).",
                "postedDate": "2025-10-09",
                "status": "active"
        },
        {
                "id": "job_1759934240401_dcbvdh1n4",
                "title": "SSC CPO Notification 2025 Out",
                "department": "SSC",
                "posts": 3073,
                "location": "All India",
                "minAge": 20,
                "maxAge": 25,
                "qualification": "Graduation",
                "lastDate": "2025-10-16",
                "blogPost": "blog-posts/ssc_cpo.html",
                "description": "",
                "postedDate": "2025-10-08",
                "status": "active"
        }
];
        this.availableBlogPosts = window.AVAILABLE_BLOG_POSTS || [];
        this.init();
    }

    init() {
        console.log(`✓ Loaded ${this.jobs.length} jobs from embedded data`);
    }

    getAllJobs() {
        return [...this.jobs];
    }

    getJobById(id) {
        return this.jobs.find(job => job.id === id);
    }

    isJobActive(lastDate) {
        return new Date(lastDate) >= new Date();
    }
}

const jobDataManager = new JobDataManager();