<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Center;
use App\Models\Collaborator;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Demo data for local development and screenshots.
     * Login: admin@clinic.test / password
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['name' => 'ROLE_ADMIN', 'description' => 'Administrator', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'ROLE_USER', 'description' => 'Client', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $centers = collect([
            ['name' => 'Beauty Lab Podil', 'phone' => '+380 44 123 45 67', 'addition' => 'Main center', 'address' => ['city' => 'Kyiv', 'street' => 'Sahaidachnoho St', 'number' => '12', 'zipCode' => '04070']],
            ['name' => 'Beauty Lab Pechersk', 'phone' => '+380 44 234 56 78', 'addition' => 'Laser and cosmetology', 'address' => ['city' => 'Kyiv', 'street' => 'Lesi Ukrainky Blvd', 'number' => '24', 'zipCode' => '01133']],
            ['name' => 'Beauty Lab Obolon', 'phone' => '+380 44 345 67 89', 'addition' => 'Hair and nails', 'address' => ['city' => 'Kyiv', 'street' => 'Obolonskyi Ave', 'number' => '7', 'zipCode' => '04205']],
        ])->map(function ($c) {
            $address = Address::create($c['address']);
            return Center::create([
                'name' => $c['name'], 'phone' => $c['phone'], 'addition' => $c['addition'], 'address_id' => $address->id,
            ]);
        });

        foreach ([
            ['Haircut & styling', '60', '650', '#e07a5f'],
            ['Hair coloring', '120', '1800', '#3d405b'],
            ['Manicure', '75', '500', '#81b29a'],
            ['Facial cleansing', '90', '1200', '#f2cc8f'],
            ['Laser hair removal', '45', '1500', '#5e60ce'],
            ['Massage', '60', '900', '#48bfe3'],
        ] as [$name, $during, $cost, $color]) {
            Service::create(compact('name', 'during', 'cost', 'color'));
        }

        foreach ([
            ['Olena Kovalenko', '1990-04-12', 'Senior hair stylist, 10 years of experience'],
            ['Iryna Shevchenko', '1994-09-03', 'Cosmetologist, facial treatments'],
            ['Mariia Bondarenko', '1997-01-25', 'Nail artist'],
            ['Andrii Melnyk', '1988-06-17', 'Massage therapist'],
            ['Kateryna Tkachenko', '1995-11-30', 'Laser specialist'],
        ] as [$name, $birth, $bio]) {
            Collaborator::create(compact('name', 'birth', 'bio'));
        }

        $admin = User::create([
            'name' => 'Admin', 'secondName' => 'Clinic', 'email' => 'admin@clinic.test',
            'password' => Hash::make('password'), 'phone' => '+380 50 000 00 00',
        ]);
        $admin->centers()->attach($centers->pluck('id'));
        DB::table('role_user')->insert(['role_id' => 1, 'user_id' => $admin->id, 'created_at' => now(), 'updated_at' => now()]);

        foreach ([
            ['Anna', 'Petrenko', 'Ivanivna', '+380 67 111 22 33', '1998-02-14', 'Kyiv', 'Khreshchatyk St', '5'],
            ['Dmytro', 'Savchenko', 'Olehovych', '+380 50 222 33 44', '1985-07-08', 'Kyiv', 'Velyka Vasylkivska St', '43'],
            ['Yuliia', 'Kravchenko', 'Serhiivna', '+380 93 333 44 55', '2001-10-21', 'Kyiv', 'Antonovycha St', '16'],
            ['Oleksandr', 'Moroz', 'Petrovych', '+380 66 444 55 66', '1992-03-03', 'Kyiv', 'Bohdana Khmelnytskoho St', '9'],
            ['Sofiia', 'Lysenko', 'Andriivna', '+380 97 555 66 77', '1999-12-09', 'Kyiv', 'Saksahanskoho St', '30'],
            ['Viktoriia', 'Rudenko', 'Mykolaivna', '+380 63 666 77 88', '1987-05-27', 'Kyiv', 'Heroiv Stalinhrada Ave', '11'],
        ] as $i => [$name, $second, $patronymic, $phone, $birthday, $city, $street, $number]) {
            $address = Address::create(['city' => $city, 'street' => $street, 'number' => $number, 'zipCode' => '0' . (4000 + $i * 11)]);
            $client = User::create([
                'name' => $name, 'secondName' => $second, 'patronymic' => $patronymic, 'phone' => $phone,
                'birthday' => $birthday, 'email' => strtolower($name . '.' . $second) . '@example.com',
                'password' => Hash::make(\Illuminate\Support\Str::random(16)), 'address_id' => $address->id,
            ]);
            $client->centers()->attach($centers[$i % 3]->id);
            DB::table('role_user')->insert(['role_id' => 2, 'user_id' => $client->id, 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}
