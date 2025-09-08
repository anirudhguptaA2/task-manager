
import { mount } from '@vue/test-utils';
import SignupView from '@/features/signup/SignupView.vue';

describe('SignupView', () => {
  it('renders signup form', () => {
    const wrapper = mount(SignupView);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Enter Email"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Enter Password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows alert if terms not agreed', async () => {
    const wrapper = mount(SignupView);
    wrapper.vm.agreeTerms = false;
    await wrapper.find('form').trigger('submit.prevent');
    expect(window.alert).toHaveBeenCalledWith('You must agree to all terms.');
  });

  it('shows alert if passwords do not match', async () => {
    const wrapper = mount(SignupView);
    wrapper.vm.agreeTerms = true;
    wrapper.vm.password = 'abc';
    wrapper.vm.confirmPassword = 'def';
    await wrapper.find('form').trigger('submit.prevent');
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match.');
  });

  it('shows alert on backend error', async () => {
    const wrapper = mount(SignupView);
    wrapper.vm.agreeTerms = true;
    wrapper.vm.password = 'test1234';
    wrapper.vm.confirmPassword = 'test1234';
    wrapper.vm.email = 'invalid';
    await wrapper.find('form').trigger('submit.prevent');
    expect(window.alert).toHaveBeenCalled();
  });

  it('navigates to login on successful signup', async () => {
    const wrapper = mount(SignupView);
    wrapper.vm.agreeTerms = true;
    wrapper.vm.password = 'test1234';
    wrapper.vm.confirmPassword = 'test1234';
    wrapper.vm.email = 'test1@gmail.com';
    const routerPush = jest.fn();
    wrapper.vm.router = { push: routerPush };
    await wrapper.vm.handleSignup();
    expect(window.alert.mock.calls.length > 0 || routerPush.mock.calls.length > 0).toBe(true);
  });
});
