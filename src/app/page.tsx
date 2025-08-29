import DishCard from '../components/DishCard';

export default function Home() {
  return (
    <main className='flex flex-row justify-between items-center'>
      <section>
        <h1 className="font-merriweather text-4xl font-bold mb-8">Welcome to <span className="font-parisienne">MealSeeker!</span></h1>
        <p className="font-merriweather text-3xl">
          Enter the ingredients you have.<br/>
          We’ll show recipes you can make.<br/> 
          Everyone knows the cooking struggle.<br/>
          Let’s find your perfect meal together!
        </p>
      </section>
      <section>
        <DishCard  
          title='Spaghetti Aglio e Olio' 
          description='italian very nice mamamia we talk a lot here. 
          like what else  does a person need to know about a dish. just cook the fucker and it god damn.' 
          servings={2} 
          timeToCook={20} 
          image='/placeholder.png' />
      </section>
    </main>
  );
}
