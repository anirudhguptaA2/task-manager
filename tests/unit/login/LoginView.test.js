import { mount } from '@vue/test-utils';
import LoginView from '@/features/login/LoginView.vue';

describe('LoginView', () => {
  it('renders login form', () => {
    const wrapper = mount(LoginView);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows error on empty submit', async () => {
    const wrapper = mount(LoginView);
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text().toLowerCase()).toContain('required');
  });

  it('calls login method with valid credentials', async () => {
    const mockLogin = jest.fn();
    const wrapper = mount(LoginView, {
      methods: { login: mockLogin }
    });
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit.prevent');
    expect(mockLogin).toHaveBeenCalled();
  });

  it('shows error on invalid email', async () => {
    const wrapper = mount(LoginView);
    await wrapper.find('input[type="email"]').setValue('invalid');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text().toLowerCase()).toContain('valid email');
  });

  it('shows error on wrong password', async () => {
    // Simulate backend error
    const wrapper = mount(LoginView);
    wrapper.vm.error = 'Invalid password';
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Invalid password');
  });
});
