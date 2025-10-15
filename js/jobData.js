// Job Data Management System - ADMIN VERSION (with localStorage)

// ===== AUTO-GENERATED: DO NOT EDIT MANUALLY =====
window.AVAILABLE_BLOG_POSTS = [
    "Bihar_SI.html",
    "DSSSBPRT.html",
    "ssc_cpo.html",
    "RRBNTPC_ShortNotice.html",
    "ddd.html"
];
// ===== END AUTO-GENERATED =====

class JobDataManager {
    constructor() {
        this.storageKey = 'admin_jobs';
        this.versionKey = 'admin_jobs_version';
        this.currentVersion = '1.1'; // Increment this to force refresh default jobs
        this.availableBlogPosts = window.AVAILABLE_BLOG_POSTS || [];
        this.jobs = [];
        this.init();
    }

    init() {
        // Check if we need to update default jobs
        const storedVersion = localStorage.getItem(this.versionKey);
        const stored = localStorage.getItem(this.storageKey);
        
        if (stored && storedVersion === this.currentVersion) {
            // Load existing jobs if version matches
            try {
                this.jobs = JSON.parse(stored);
                console.log(`✓ Loaded ${this.jobs.length} jobs from localStorage`);
            } catch (e) {
                console.error('Error parsing stored jobs:', e);
                this.jobs = this.getDefaultJobs();
                this.saveToStorage();
            }
        } else {
            // Version mismatch or no stored data - use default jobs
            console.log('🔄 Refreshing with updated default jobs...');
            this.jobs = this.getDefaultJobs();
            localStorage.setItem(this.versionKey, this.currentVersion);
            this.saveToStorage();
            console.log(`✓ Initialized with ${this.jobs.length} default jobs`);
        }
    }

    getDefaultJobs() {
        return [
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
                "qualification": "Bachelor's degree in any stream",
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
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.jobs));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    }

    getAllJobs() {
        return [...this.jobs];
    }

    getJobById(id) {
        return this.jobs.find(job => job.id === id);
    }

    addJob(jobData) {
        const newJob = {
            ...jobData,
            id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            postedDate: new Date().toISOString().split('T')[0],
            status: this.isJobActive(jobData.lastDate) ? 'active' : 'expired'
        };

        this.jobs.unshift(newJob);
        this.saveToStorage();
        console.log('✓ Job added:', newJob.title);
        return newJob;
    }

    updateJob(id, updates) {
        const index = this.jobs.findIndex(job => job.id === id);
        if (index === -1) {
            console.error('Job not found:', id);
            return null;
        }

        this.jobs[index] = {
            ...this.jobs[index],
            ...updates,
            status: this.isJobActive(updates.lastDate) ? 'active' : 'expired'
        };

        this.saveToStorage();
        console.log('✓ Job updated:', this.jobs[index].title);
        return this.jobs[index];
    }

    deleteJob(id) {
        const index = this.jobs.findIndex(job => job.id === id);
        if (index === -1) {
            console.error('Job not found:', id);
            return false;
        }

        const deletedJob = this.jobs.splice(index, 1)[0];
        this.saveToStorage();
        console.log('✓ Job deleted:', deletedJob.title);
        return true;
    }

    deleteJobs(ids) {
        const idsSet = new Set(ids);
        const beforeCount = this.jobs.length;
        
        this.jobs = this.jobs.filter(job => !idsSet.has(job.id));
        
        const deletedCount = beforeCount - this.jobs.length;
        this.saveToStorage();
        console.log(`✓ Deleted ${deletedCount} jobs`);
        return deletedCount;
    }

    isJobActive(lastDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const jobDate = new Date(lastDate);
        jobDate.setHours(0, 0, 0, 0);
        return jobDate >= today;
    }

    // Export jobs for public site
    exportForPublic() {
        return this.jobs.map(job => ({
            ...job,
            status: this.isJobActive(job.lastDate) ? 'active' : 'expired'
        }));
    }
}

// Initialize the job data manager
const jobDataManager = new JobDataManager();