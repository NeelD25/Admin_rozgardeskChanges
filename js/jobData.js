// Job Data Management System - ADMIN VERSION (with localStorage)

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
        this.storageKey = 'admin_jobs';
        this.availableBlogPosts = window.AVAILABLE_BLOG_POSTS || [];
        this.jobs = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) {
            console.warn('JobDataManager already initialized');
            return;
        }

        // Load from localStorage first
        const stored = localStorage.getItem(this.storageKey);
        
        if (stored) {
            try {
                this.jobs = JSON.parse(stored);
                console.log(`✓ Loaded ${this.jobs.length} jobs from localStorage`);
            } catch (e) {
                console.error('Error parsing stored jobs:', e);
                this.jobs = this.getDefaultJobs();
                this.saveToStorage();
            }
        } else {
            // First time - use default jobs
            this.jobs = this.getDefaultJobs();
            this.saveToStorage();
            console.log(`✓ Initialized with ${this.jobs.length} default jobs`);
        }

        this.isInitialized = true;
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
            console.log('💾 Saved to localStorage');
            return true;
        } catch (e) {
            console.error('❌ Error saving to localStorage:', e);
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
        try {
            const newJob = {
                title: jobData.title,
                department: jobData.department,
                posts: parseInt(jobData.posts) || 0,
                location: jobData.location,
                minAge: jobData.minAge ? parseInt(jobData.minAge) : null,
                maxAge: jobData.maxAge ? parseInt(jobData.maxAge) : null,
                qualification: jobData.qualification,
                lastDate: jobData.lastDate,
                blogPost: jobData.blogPost,
                description: jobData.description || '',
                id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                postedDate: new Date().toISOString().split('T')[0],
                status: this.isJobActive(jobData.lastDate) ? 'active' : 'expired'
            };

            this.jobs.unshift(newJob);
            const saved = this.saveToStorage();
            
            if (saved) {
                console.log('✓ Job added successfully:', newJob.title);
                return newJob;
            } else {
                throw new Error('Failed to save to storage');
            }
        } catch (error) {
            console.error('❌ Error in addJob:', error);
            throw error;
        }
    }

    updateJob(id, updates) {
        try {
            const index = this.jobs.findIndex(job => job.id === id);
            if (index === -1) {
                console.error('❌ Job not found:', id);
                return null;
            }

            // Create updated job object with proper data types
            const updatedJob = {
                ...this.jobs[index],
                title: updates.title,
                department: updates.department,
                posts: parseInt(updates.posts) || 0,
                location: updates.location,
                minAge: updates.minAge ? parseInt(updates.minAge) : null,
                maxAge: updates.maxAge ? parseInt(updates.maxAge) : null,
                qualification: updates.qualification,
                lastDate: updates.lastDate,
                blogPost: updates.blogPost,
                description: updates.description || '',
                status: this.isJobActive(updates.lastDate) ? 'active' : 'expired'
            };

            this.jobs[index] = updatedJob;
            const saved = this.saveToStorage();
            
            if (saved) {
                console.log('✓ Job updated successfully:', updatedJob.title);
                return updatedJob;
            } else {
                throw new Error('Failed to save to storage');
            }
        } catch (error) {
            console.error('❌ Error in updateJob:', error);
            throw error;
        }
    }

    deleteJob(id) {
        try {
            const index = this.jobs.findIndex(job => job.id === id);
            if (index === -1) {
                console.error('❌ Job not found:', id);
                return false;
            }

            const deletedJob = this.jobs.splice(index, 1)[0];
            const saved = this.saveToStorage();
            
            if (saved) {
                console.log('✓ Job deleted successfully:', deletedJob.title);
                return true;
            } else {
                throw new Error('Failed to save to storage');
            }
        } catch (error) {
            console.error('❌ Error in deleteJob:', error);
            return false;
        }
    }

    deleteJobs(ids) {
        try {
            const idsSet = new Set(ids);
            const beforeCount = this.jobs.length;
            
            this.jobs = this.jobs.filter(job => !idsSet.has(job.id));
            
            const deletedCount = beforeCount - this.jobs.length;
            const saved = this.saveToStorage();
            
            if (saved) {
                console.log(`✓ Deleted ${deletedCount} jobs successfully`);
                return deletedCount;
            } else {
                throw new Error('Failed to save to storage');
            }
        } catch (error) {
            console.error('❌ Error in deleteJobs:', error);
            return 0;
        }
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

    // Clear all data (for debugging)
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.jobs = this.getDefaultJobs();
        this.saveToStorage();
        console.log('🔄 Reset to default jobs');
        return true;
    }
}

// Initialize the job data manager - single instance
const jobDataManager = new JobDataManager();

// Make it globally accessible for debugging
window.jobDataManager = jobDataManager;

// Debug helper - type this in console if needed: jobDataManager.clearAllData()
console.log('💡 Debug: Type "jobDataManager.clearAllData()" in console to reset all jobs');