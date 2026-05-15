const API_BASE_URL = '/server';

// API utility functions
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          errorMessage = await response.text();
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage || `Error ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }
    return response.text();
  }

  async login(rollNo: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getUsersByRole(role: string) {
    const response = await fetch(`${API_BASE_URL}/users/role/${role}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async requestGatePass(passData: any) {
    const response = await fetch(`${API_BASE_URL}/gatepasses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passData),
    });
    return this.handleResponse(response);
  }

  async getMyGatePasses() {
    const response = await fetch(`${API_BASE_URL}/gatepasses/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getGatePassStats() {
    const response = await fetch(`${API_BASE_URL}/gatepasses/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPendingGatePasses() {
    const response = await fetch(`${API_BASE_URL}/gatepasses/pending`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async approveGatePass(id: number, comment?: string) {
    const response = await fetch(`${API_BASE_URL}/gatepasses/${id}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comment }),
    });
    return this.handleResponse(response);
  }

  async rejectGatePass(id: number, comment?: string) {
    const response = await fetch(`${API_BASE_URL}/gatepasses/${id}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comment }),
    });
    return this.handleResponse(response);
  }

  async scanGatePass(id: number, type: string) {
    const response = await fetch(`${API_BASE_URL}/gatepasses/${id}/scan?type=${type}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
  
  async getStaffDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/gatepasses/staff/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();