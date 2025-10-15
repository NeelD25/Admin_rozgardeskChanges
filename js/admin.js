// Admin Panel Logic for Government Jobs Portal
class AdminManager {
    constructor() {
        this.selectedJobs = new Set();
        this.currentFilters = { search: '', status: '' };
        this.availableBlogs = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAdminData();
        this.loadAvailableBlogPosts();
    }

    loadAvailableBlogPosts(excludeJobId = null) {
        if (window.AVAILABLE_BLOG_POSTS && Array.isArray(window.AVAILABLE_BLOG_POSTS)) {
            this.availableBlogs = window.AVAILABLE_BLOG_POSTS.filter(file => file.endsWith('.html'));
        } else {
            console.error('❌ AVAILABLE_BLOG_POSTS not found in jobData.js');
            this.availableBlogs = [];
        }
        
        this.populateBlogDropdowns(excludeJobId);
    }

    populateBlogDropdowns(excludeJobId = null) {
        const blogPostSelect = document.getElementById('blogPost');
        const editBlogPostSelect = document.getElementById('editBlogPost');

        if (blogPostSelect) {
            this.populateBlogSelect(blogPostSelect, excludeJobId);
        }

        if (editBlogPostSelect) {
            this.populateBlogSelect(editBlogPostSelect, excludeJobId);
        }
    }

    populateBlogSelect(selectElement, excludeJobId) {
        if (!selectElement) return;

        const usedBlogPosts = jobDataManager.getAllJobs()
            .filter(job => job.id !== excludeJobId) // Exclude current job's blog post if in edit mode
            .map(job => job.blogPost)
            .filter(blog => blog);

        const availableBlogs = this.availableBlogs.filter(blog => {
            const fullPath = `blog-posts/${blog}`;
            return !usedBlogPosts.includes(fullPath);
        });

        const currentValue = selectElement.value; // Save current value for edit mode

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Choose Blog Post HTML File...';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        if (this.availableBlogs.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '❌ No blog posts in jobData.js';
            option.disabled = true;
            selectElement.appendChild(option);
            return;
        }

        // Add the current job's blog post to the edit modal if it exists and is used
        if (excludeJobId) {
            const job = jobDataManager.getJobById(excludeJobId);
            if (job && job.blogPost && !availableBlogs.map(b => `blog-posts/${b}`).includes(job.blogPost)) {
                const blogFileName = job.blogPost.split('/').pop();
                const option = document.createElement('option');
                option.value = job.blogPost;
                option.textContent = blogFileName + ' (current)';
                selectElement.appendChild(option);
            }
        }

        availableBlogs.forEach(blog => {
            const option = document.createElement('option');
            option.value = `blog-posts/${blog}`;
            option.textContent = blog;
            selectElement.appendChild(option);
        });

        // Restore value in edit modal
        if (currentValue) {
            selectElement.value = currentValue;
        }
    }

    setupEventListeners() {
        const addJobForm = document.getElementById('addJobForm');
        if (addJobForm) {
            // Attach submit handler for Add Job
            addJobForm.addEventListener('submit', (e) => this.handleAddJob(e));
        }

        const editJobForm = document.getElementById('editJobForm');
        if (editJobForm) {
            // Attach submit handler for Edit Job
            editJobForm.addEventListener('submit', (e) => this.handleEditJob(e));
        }

        const adminSearch = document.getElementById('adminSearch');
        const statusFilter = document.getElementById('statusFilter');

        if (adminSearch) {
            adminSearch.addEventListener('input', () => this.handleFilterChange());
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.handleFilterChange());
        }

        const tableBody = document.getElementById('adminJobsTable');
        if (tableBody) {
             // Use event delegation for checkboxes
             tableBody.addEventListener('change', (e) => {
                if (e.target.classList.contains('job-checkbox')) {
                    this.toggleJobSelection(e.target.dataset.jobId, e.target.checked);
                }
             });
        }
        
        window.addEventListener('click', (event) => {
            const editModal = document.getElementById('editJobModal');
            if (event.target === editModal) {
                this.closeEditModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeEditModal();
            }
        });

        this.setMinimumDates();
    }

    setMinimumDates() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            // Do not override a potentially blank date in the edit modal before it's opened
            if (!input.value) { 
                input.min = today;
            }
        });
    }

    async loadAdminData() {
        try {
            this.displayAdminJobs();
            this.updateAdminStats();
        } catch (error) {
            console.error('Error loading admin data:', error);
            this.showMessage('Error loading data. Please refresh the page.', 'error');
        }
    }

    handleFilterChange() {
        const adminSearch = document.getElementById('adminSearch');
        const statusFilter = document.getElementById('statusFilter');

        this.currentFilters = {
            search: adminSearch?.value.toLowerCase() || '',
            status: statusFilter?.value || ''
        };

        this.displayAdminJobs();
    }

    async handleAddJob(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            form.classList.add('form-loading');

            const formData = new FormData(form);
            const jobData = this.parseFormData(formData);

            const validation = this.validateJobData(jobData);
            if (!validation.isValid) {
                // If validation fails, throw error, catch block shows message
                throw new Error(validation.message);
            }

            jobDataManager.addJob(jobData);

            form.reset();
            this.setMinimumDates();
            this.displayAdminJobs();
            this.updateAdminStats();
            this.loadAvailableBlogPosts();

            this.showMessage('Job added successfully!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Error adding job:', error);
            this.showMessage(error.message || 'Error adding job. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            form.classList.remove('form-loading');
        }
    }

    async handleEditJob(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';
            form.classList.add('form-loading');

            const formData = new FormData(form);
            const jobData = this.parseFormData(formData);
            const jobId = form.querySelector('#editJobId').value;
            
            const validation = this.validateJobData(jobData);
            if (!validation.isValid) {
                // If validation fails, throw error, catch block shows message
                throw new Error(validation.message);
            }

            const updatedJob = jobDataManager.updateJob(jobId, jobData);
            if (!updatedJob) {
                throw new Error('Job not found');
            }

            this.closeEditModal();
            this.displayAdminJobs();
            this.updateAdminStats();
            this.loadAvailableBlogPosts();

            this.showMessage('Job updated successfully!', 'success');

        } catch (error) {
            console.error('Error updating job:', error);
            this.showMessage(error.message || 'Error updating job. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            form.classList.remove('form-loading');
        }
    }

    parseFormData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'posts') {
                // Posts is required and must be a number > 0
                data[key] = value ? parseInt(value) : 0;
            } else if (key === 'minAge' || key === 'maxAge') {
                // Min/Max Age are optional, can be null
                data[key] = value ? parseInt(value) : null;
            } else {
                // All other fields (title, department, lastDate, blogPost, etc.) are strings
                data[key] = value.trim();
            }
        }
        return data;
    }

    validateJobData(data) {
        if (!data.title || data.title.length === 0) return { isValid: false, message: 'Job title is required' };
        if (!data.department || data.department.length === 0) return { isValid: false, message: 'Department is required' };
        if (!data.posts || data.posts < 1) return { isValid: false, message: 'Number of posts must be at least 1' };
        if (!data.location || data.location.length === 0) return { isValid: false, message: 'Location is required' };
        if (!data.qualification || data.qualification.length === 0) return { isValid: false, message: 'Qualification is required' };
        if (!data.blogPost || data.blogPost.length === 0) return { isValid: false, message: 'Please select a blog post page' };
        if (!data.lastDate || data.lastDate.length === 0) return { isValid: false, message: 'Last date is required' };
        
        // Use string comparison for dates (YYYY-MM-DD format) for reliable future/past check
        const todayString = new Date().toISOString().split('T')[0];
        if (data.lastDate < todayString) return { isValid: false, message: 'Last date must be today or in the future' };
        
        if (data.minAge !== null && data.maxAge !== null && data.minAge > data.maxAge) return { isValid: false, message: 'Min age cannot be greater than max age' };

        return { isValid: true };
    }

    displayAdminJobs() {
        const tableBody = document.getElementById('adminJobsTable');
        if (!tableBody) return;

        let jobs = jobDataManager.getAllJobs();

        if (this.currentFilters.search) {
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(this.currentFilters.search) ||
                job.department.toLowerCase().includes(this.currentFilters.search) ||
                job.location.toLowerCase().includes(this.currentFilters.search)
            );
        }

        if (this.currentFilters.status) {
            jobs = jobs.filter(job => {
                const status = jobDataManager.isJobActive(job.lastDate) ? 'active' : 'expired';
                return status === this.currentFilters.status;
            });
        }

        jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

        if (jobs.length === 0) {
            tableBody.innerHTML = `
                <tr class="no-data-row">
                    <td colspan="9">
                        <div class="no-data">
                            <svg width="60" height="60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p>No jobs found. Add your first job using the form above!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = jobs.map(job => {
            const isActive = jobDataManager.isJobActive(job.lastDate);
            const statusClass = isActive ? 'status-active' : 'status-expired';
            const statusText = isActive ? 'Active' : 'Expired';

            const blogFileName = job.blogPost ? job.blogPost.split('/').pop() : 'Not assigned';

            return `
                <tr>
                    <td>
                        <input type="checkbox" 
                               class="job-checkbox" 
                               data-job-id="${job.id}"
                               ${this.selectedJobs.has(job.id) ? 'checked' : ''}>
                    </td>
                    <td class="job-title-cell">${this.escapeHtml(job.title)}</td>
                    <td>${this.escapeHtml(job.department)}</td>
                    <td>${job.posts.toLocaleString()}</td>
                    <td>${this.escapeHtml(job.location)}</td>
                    <td>${this.formatDate(job.lastDate)}</td>
                    <td class="blog-post-cell" title="${this.escapeHtml(job.blogPost || '')}">${this.escapeHtml(blogFileName)}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td class="actions-cell">
                        <button class="edit-btn" onclick="adminManager.editJob('${job.id}')" title="Edit Job">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                        </button>
                        <button class="delete-btn" onclick="adminManager.deleteJob('${job.id}')" title="Delete Job">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = jobs.length > 0 && this.selectedJobs.size === jobs.length;
        }
    }

    toggleJobSelection(jobId, isSelected) {
        if (isSelected) {
            this.selectedJobs.add(jobId);
        } else {
            this.selectedJobs.delete(jobId);
        }
    }

    toggleSelectAll() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.job-checkbox');

        const visibleJobs = jobDataManager.getAllJobs().filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(this.currentFilters.search) || job.department.toLowerCase().includes(this.currentFilters.search);
            const matchesStatus = this.currentFilters.status === '' || (jobDataManager.isJobActive(job.lastDate) ? 'active' : 'expired') === this.currentFilters.status;
            return matchesSearch && matchesStatus;
        });

        if (selectAllCheckbox.checked) {
            visibleJobs.forEach(job => {
                this.selectedJobs.add(job.id);
            });
            checkboxes.forEach(cb => cb.checked = true);
        } else {
            visibleJobs.forEach(job => {
                this.selectedJobs.delete(job.id);
            });
            checkboxes.forEach(cb => cb.checked = false);
        }
    }

    async bulkDelete() {
        if (this.selectedJobs.size === 0) {
            this.showMessage('Please select jobs to delete', 'error');
            return;
        }

        const count = this.selectedJobs.size;
        if (!confirm(`Are you sure you want to delete ${count} selected job(s)? This action cannot be undone.`)) {
            return;
        }

        try {
            const jobIds = Array.from(this.selectedJobs);
            jobDataManager.deleteJobs(jobIds);
            
            this.selectedJobs.clear();
            this.displayAdminJobs();
            this.updateAdminStats();
            this.loadAvailableBlogPosts();
            
            this.showMessage(`${count} job(s) deleted successfully`, 'success');
        } catch (error) {
            console.error('Error deleting jobs:', error);
            this.showMessage('Error deleting jobs. Please try again.', 'error');
        }
    }

    editJob(jobId) {
        const job = jobDataManager.getJobById(jobId);
        if (!job) {
            this.showMessage('Job not found', 'error');
            return;
        }

        this.loadAvailableBlogPosts(jobId);

        // Populate edit form fields
        document.getElementById('editJobId').value = job.id;
        document.getElementById('editJobTitle').value = job.title;
        document.getElementById('editDepartment').value = job.department;
        document.getElementById('editPosts').value = job.posts;
        document.getElementById('editLocation').value = job.location;
        
        // CRITICAL FIX: Ensure null values are set to empty string for form inputs
        document.getElementById('editMinAge').value = job.minAge !== null ? job.minAge : ''; 
        document.getElementById('editMaxAge').value = job.maxAge !== null ? job.maxAge : ''; 
        
        document.getElementById('editQualification').value = job.qualification;
        document.getElementById('editLastDate').value = job.lastDate;
        document.getElementById('editDescription').value = job.description || '';

        const editBlogPostSelect = document.getElementById('editBlogPost');
        if (editBlogPostSelect && job.blogPost) {
            editBlogPostSelect.value = job.blogPost;
        }

        document.getElementById('editJobModal').style.display = 'flex';
    }

    closeEditModal() {
        document.getElementById('editJobModal').style.display = 'none';
    }

    async deleteJob(jobId) {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }

        try {
            const success = jobDataManager.deleteJob(jobId);
            if (success) {
                this.selectedJobs.delete(jobId);
                this.displayAdminJobs();
                this.updateAdminStats();
                this.loadAvailableBlogPosts();
                this.showMessage('Job deleted successfully', 'success');
            } else {
                throw new Error('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            this.showMessage('Error deleting job. Please try again.', 'error');
        }
    }

    updateAdminStats() {
        const allJobs = jobDataManager.getAllJobs();
        const totalJobs = allJobs.length;
        const activeJobs = allJobs.filter(job => jobDataManager.isJobActive(job.lastDate)).length;
        const expiredJobs = totalJobs - activeJobs;

        document.getElementById('totalJobsCount').textContent = totalJobs;
        document.getElementById('activeJobsCount').textContent = activeJobs;
        document.getElementById('expiredJobsCount').textContent = expiredJobs;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'success') {
        const existingMessage = document.querySelector('.admin-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message ${type}`;
        messageDiv.innerHTML = `
            <span>${this.escapeHtml(message)}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminManager();
});