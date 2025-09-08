import { mount } from '@vue/test-utils';

describe('LoginView', () => {
  it('renders login form', () => {
    const LoginView = require('@/features/login/LoginView.vue').default;
    const wrapper = mount(LoginView);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Enter Username"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Enter Password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows alert on login error', async () => {
    jest.resetModules();
    jest.doMock('firebase/auth', () => ({
      getAuth: () => ({}),
      signInWithEmailAndPassword: () => Promise.reject(new Error('Invalid credentials')),
    }));
    const LoginView = (await import('@/features/login/LoginView.vue')).default;
    const wrapper = mount(LoginView);
    wrapper.vm.email = 'invalid@example.com';
    wrapper.vm.password = 'wrongpassword';
    await wrapper.find('form').trigger('submit.prevent');
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('navigates to dashboard on successful login', async () => {
    jest.resetModules();
    jest.doMock('firebase/auth', () => ({
      getAuth: () => ({}),
      signInWithEmailAndPassword: () => Promise.resolve(),
    }));
    const routerPush = jest.fn();
    jest.doMock('vue-router', () => ({
      useRouter: () => ({ push: routerPush }),
      useRoute: () => ({}),
    }));
    const LoginView = (await import('@/features/login/LoginView.vue')).default;
    const wrapper = mount(LoginView, {
      global: {
        mocks: {
          $router: { push: routerPush },
        },
      },
    });
    wrapper.vm.email = 'test1@gmail.com';
    wrapper.vm.password = 'test1234';
    await wrapper.find('form').trigger('submit.prevent');
    expect(routerPush).toHaveBeenCalledWith('/dashboard');
  });
});
