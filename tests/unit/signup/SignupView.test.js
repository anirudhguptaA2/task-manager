import { mount } from '@vue/test-utils';
import SignupView from '@/features/signup/SignupView.vue';

describe('SignupView', () => {
  it('renders signup form', () => {
    const wrapper = mount(SignupView);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows error on empty submit', async () => {
    const wrapper = mount(SignupView);
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text().toLowerCase()).toContain('required');
  });

  it('shows error if passwords do not match', async () => {
    const wrapper = mount(SignupView);
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('input[type="password"]').setValue('password456');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text().toLowerCase()).toContain('match');
  });

  it('calls signup method with valid credentials', async () => {
    const mockSignup = jest.fn();
    const wrapper = mount(SignupView, {
      methods: { signup: mockSignup }
    });
    await wrapper.find('input[type="email"]').setValue('test1@gmail.com');
    await wrapper.find('input[type="password"]').setValue('test1234');
    await wrapper.find('form').trigger('submit.prevent');
    expect(mockSignup).toHaveBeenCalled();
  });

  it('shows error on invalid email', async () => {
    const wrapper = mount(SignupView);
    await wrapper.find('input[type="email"]').setValue('invalid');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text().toLowerCase()).toContain('valid email');
  });

  it('shows error on backend failure', async () => {
    const wrapper = mount(SignupView);
    wrapper.vm.error = 'Signup failed';
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Signup failed');
  });
});
